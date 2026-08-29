import argparse
import asyncio
import hashlib
import logging
import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy.exc import SQLAlchemyError
from qdrant_client.models import Filter, FieldCondition, MatchValue

from app.database import engine, AsyncSessionFactory
from app.qdrant_client import qdrant_manager
from app.ingestion.sources_seed import SEED_SOURCES
from app.ingestion.parser import parse_source
from app.ingestion.chunker import chunk_document
from app.ingestion.embedder import embed_and_store_chunks
from app.services.source_repository import SourceRepository, ChunkRepository
from app.models.source import Source

# Configure basic logging for the CLI script
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("run_ingestion")


async def process_source(
    seed_source: dict,
    db_session,
    source_repo: SourceRepository,
    chunk_repo: ChunkRepository
) -> dict:
    """
    Processes a single source through the ingestion pipeline.
    Returns a status dict.
    """
    url = seed_source["url"]
    source_type = seed_source["source_type"]
    title = seed_source.get("title", url)

    logger.info(f"Processing source: {url}")
    
    # 1. Fetch or create source record
    # Note: For this script, we look up by URL as a unique identifier
    from sqlalchemy import select
    result = await db_session.execute(select(Source).filter_by(url=url))
    db_source = result.scalars().first()

    if not db_source:
        db_source = Source(
            title=title,
            url=url,
            source_type=source_type
        )
        await source_repo.create(db_source)
        logger.info(f"Created new source record: {db_source.id}")

    try:
        # 2. Parse the document
        raw_text, elements = await parse_source(url, source_type)
        
        # 3. Check for content changes
        content_hash = hashlib.sha256(raw_text.encode("utf-8")).hexdigest()
        
        if db_source.checksum == content_hash:
            logger.info(f"Source {db_source.id} is unchanged. Skipping ingestion.")
            return {"status": "skipped"}
            
        logger.info(f"Content changed for source {db_source.id}. Re-indexing.")

        # 4. Clean up existing chunks and vectors
        # Delete vectors in Qdrant
        await qdrant_manager.async_client.delete(
            collection_name=qdrant_manager.collection_name,
            points_selector=Filter(
                must=[
                    FieldCondition(
                        key="source_id",
                        match=MatchValue(value=str(db_source.id))
                    )
                ]
            )
        )
        # Delete chunk rows in Postgres
        await chunk_repo.delete_by_source_id(db_source.id)

        # 5. Chunk the document
        chunks_data = chunk_document(raw_text, elements, source_type)
        
        # 6. Embed and store
        num_chunks = await embed_and_store_chunks(
            source_id=db_source.id,
            source_type=source_type,
            chunks_data=chunks_data,
            standard_id=None, # Simplified for ingestion script
            chunk_repo=chunk_repo
        )
        
        # 7. Update source metadata
        await source_repo.update(db_source, {
            "checksum": content_hash,
            "indexed_at": datetime.now(timezone.utc)
        })
        
        logger.info(f"Successfully processed source {db_source.id} ({num_chunks} chunks)")
        return {"status": "processed", "chunks": num_chunks}
        
    except Exception as e:
        logger.error(f"Failed to process source {url}: {e}")
        return {"status": "failed", "error": str(e)}


async def run_pipeline(target_source_id: Optional[str] = None):
    logger.info("Starting ingestion pipeline...")
    
    # Check seed list for placeholders
    if any("example.com" in s["url"] or "placeholder" in s["url"] for s in SEED_SOURCES):
        logger.warning("Seed list contains placeholder URLs! Update SEED_SOURCES with real BIS URLs before production use.")

    summary = {
        "processed": 0,
        "skipped": 0,
        "failed": 0,
        "chunks_created": 0
    }

    async with AsyncSessionFactory() as session:
        async with session.begin():
            source_repo = SourceRepository(session)
            chunk_repo = ChunkRepository(session)
            
            for seed in SEED_SOURCES:
                # If filtering by source_id, we need to match the DB record
                if target_source_id:
                    from sqlalchemy import select
                    res = await session.execute(select(Source).filter_by(url=seed["url"]))
                    db_src = res.scalars().first()
                    if not db_src or str(db_src.id) != target_source_id:
                        continue
                        
                res = await process_source(seed, session, source_repo, chunk_repo)
                
                if res["status"] == "processed":
                    summary["processed"] += 1
                    summary["chunks_created"] += res.get("chunks", 0)
                elif res["status"] == "skipped":
                    summary["skipped"] += 1
                elif res["status"] == "failed":
                    summary["failed"] += 1

    logger.info("=== Ingestion Summary ===")
    logger.info(f"Sources Processed: {summary['processed']}")
    logger.info(f"Sources Skipped: {summary['skipped']}")
    logger.info(f"Sources Failed: {summary['failed']}")
    logger.info(f"Total Chunks Created: {summary['chunks_created']}")
    logger.info("=========================")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run the ManakAI Ingestion Pipeline.")
    parser.add_argument("--source-id", type=str, help="Specific source UUID to ingest/re-index", default=None)
    args = parser.parse_args()
    
    asyncio.run(run_pipeline(args.source_id))
