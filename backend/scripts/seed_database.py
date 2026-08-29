import asyncio
import json
import logging
import os
import sys
import uuid
from pathlib import Path
from typing import Dict, Any, Optional

from sqlalchemy import select
from qdrant_client.models import PointStruct

from app.database import AsyncSessionFactory
from app.qdrant_client import qdrant_manager
from app.services.embedding_service import embedding_service
from app.services.source_repository import SourceRepository, ChunkRepository
from app.services.standard_repository import StandardRepository
from app.models.source import Source, Chunk
from app.models.standard import Standard
from app.ingestion.embedder import derive_qdrant_point_id

# Configure logger
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("seed_database")


async def seed_data(json_path: Optional[str] = None) -> Dict[str, int]:
    """
    Reads the manual seed JSON file, updates or inserts records into PostgreSQL via repositories,
    embeds text payloads, and upserts vectors into Qdrant.
    
    Returns a dictionary of execution metrics.
    """
    metrics = {
        "Inserted Standards": 0,
        "Updated Standards": 0,
        "Inserted Sources": 0,
        "Updated Sources": 0,
        "Inserted Chunks": 0,
        "Updated Chunks": 0,
        "Embedded": 0,
        "Skipped": 0,
        "Errors": 0,
    }

    if json_path is None:
        json_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "manual_seed.json")

    logger.info(f"Loading seed data from {json_path}")
    with open(json_path, "r", encoding="utf-8") as f:
        items = json.load(f)

    async with AsyncSessionFactory() as session:
        async with session.begin():
            source_repo = SourceRepository(session)
            standard_repo = StandardRepository(session)
            chunk_repo = ChunkRepository(session)

            for item in items:
                try:
                    url = item["url"]
                    title = item["title"]
                    source_type = item["source_type"]
                    chunk_text = item["chunk"]
                    standard_code = item.get("standard_code")

                    # 1. Source Idempotency (Lookup by URL)
                    res_source = await session.execute(select(Source).filter_by(url=url))
                    source = res_source.scalars().first()

                    if source:
                        await source_repo.update(source, {
                            "title": title,
                            "source_type": source_type
                        })
                        metrics["Updated Sources"] += 1
                    else:
                        source = Source(
                            title=title,
                            url=url,
                            source_type=source_type
                        )
                        source = await source_repo.create(source)
                        metrics["Inserted Sources"] += 1

                    # 2. Standard Idempotency (Lookup by Code if present)
                    standard = None
                    if standard_code:
                        standard = await standard_repo.get_by_code(standard_code)
                        if standard:
                            await standard_repo.update(standard, {
                                "title": title,
                                "scope": item.get("scope"),
                                "status": item.get("status"),
                                "version": item.get("version"),
                                "source_id": source.id
                            })
                            metrics["Updated Standards"] += 1
                        else:
                            standard = Standard(
                                code=standard_code,
                                title=title,
                                scope=item.get("scope"),
                                status=item.get("status"),
                                version=item.get("version"),
                                source_id=source.id
                            )
                            standard = await standard_repo.create(standard)
                            metrics["Inserted Standards"] += 1

                    # 3. Generate Embedding
                    embeddings = await embedding_service.embed_documents([chunk_text])
                    metrics["Embedded"] += 1
                    embedding = embeddings[0]

                    # 4. Chunk & Qdrant Point Idempotency
                    qdrant_point_id = derive_qdrant_point_id(source.id, 0)
                    
                    # Check existing chunks for this source
                    existing_chunks = await chunk_repo.list_by_source_id(source.id)
                    existing_chunk = next((c for c in existing_chunks if c.chunk_index == 0), None)
                    
                    chunk_id = existing_chunk.id if existing_chunk else uuid.uuid4()

                    # Upsert Point to Qdrant Vector Store
                    point = PointStruct(
                        id=str(qdrant_point_id),
                        vector=embedding,
                        payload={
                            "chunk_id": str(chunk_id),
                            "source_id": str(source.id),
                            "standard_id": str(standard.id) if standard else None,
                            "source_type": source_type,
                            "is_table": False,
                            "text": chunk_text,
                        }
                    )
                    
                    await qdrant_manager.async_client.upsert(
                        collection_name=qdrant_manager.collection_name,
                        points=[point]
                    )

                    # Update or Insert Chunk row in Postgres
                    if existing_chunk:
                        await chunk_repo.update(existing_chunk, {
                            "text": chunk_text,
                            "standard_id": standard.id if standard else None,
                            "qdrant_point_id": qdrant_point_id
                        })
                        metrics["Updated Chunks"] += 1
                    else:
                        chunk_record = Chunk(
                            id=chunk_id,
                            source_id=source.id,
                            standard_id=standard.id if standard else None,
                            text=chunk_text,
                            qdrant_point_id=qdrant_point_id,
                            chunk_index=0
                        )
                        await chunk_repo.create(chunk_record)
                        metrics["Inserted Chunks"] += 1

                except Exception as e:
                    logger.error(f"Error seeding item '{item.get('title')}': {e}", exc_info=True)
                    metrics["Errors"] += 1

    # Print summary output
    print("\n=== Seeding Summary ===")
    for key, val in metrics.items():
        print(f"{key}: {val}")
    print("=======================\n")
    
    return metrics


if __name__ == "__main__":
    asyncio.run(seed_data())
