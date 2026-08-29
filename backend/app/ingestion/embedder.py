import hashlib
import logging
import uuid
from typing import List, Dict, Any, Optional
from qdrant_client.models import PointStruct

from app.config import settings
from app.qdrant_client import qdrant_manager
from app.services.embedding_service import embedding_service
from app.models.source import Chunk
from app.services.source_repository import ChunkRepository

logger = logging.getLogger(__name__)


def derive_qdrant_point_id(source_id: uuid.UUID, chunk_index: int) -> uuid.UUID:
    """
    Derives a deterministic UUID from source_id and chunk_index using SHA-256.
    This guarantees that re-indexing does not produce duplicates in Qdrant.
    """
    hash_input = f"{source_id}:{chunk_index}"
    hasher = hashlib.sha256(hash_input.encode("utf-8"))
    hash_bytes = hasher.digest()
    # Construct a valid UUID from the first 16 bytes of the hash
    return uuid.UUID(bytes=hash_bytes[:16])


async def embed_and_store_chunks(
    source_id: uuid.UUID,
    source_type: str,
    chunks_data: List[Dict[str, Any]],
    standard_id: Optional[uuid.UUID],
    chunk_repo: ChunkRepository
) -> int:
    """
    Generates embeddings for chunks, writes them to Qdrant, and persists Chunk models in Postgres.
    
    Returns:
        Number of chunks processed.
    """
    if not chunks_data:
        logger.info(f"No chunks to embed for source {source_id}")
        return 0

    logger.info(f"Generating embeddings for {len(chunks_data)} chunks (source: {source_id})")
    
    # 1. Extract texts and generate embeddings
    texts = [chunk["text"] for chunk in chunks_data]
    embeddings = await embedding_service.embed_documents(texts)
    
    points = []
    chunk_records = []

    # 2. Build Qdrant PointStructs and Postgres Chunk models
    for idx, (chunk_info, embedding) in enumerate(zip(chunks_data, embeddings)):
        chunk_text = chunk_info["text"]
        is_table = chunk_info.get("is_table", False)
        chunk_index = chunk_info["chunk_index"]
        
        # Derive deterministic UUID point ID
        qdrant_point_id = derive_qdrant_point_id(source_id, chunk_index)
        chunk_id = uuid.uuid4()  # Fresh primary key for Chunk table

        # Create Qdrant vector point
        point = PointStruct(
            id=str(qdrant_point_id),
            vector=embedding,
            payload={
                "chunk_id": str(chunk_id),
                "source_id": str(source_id),
                "standard_id": str(standard_id) if standard_id else None,
                "source_type": source_type,
                "is_table": is_table,
                "text": chunk_text,
            }
        )
        points.append(point)

        # Create Chunk ORM model
        chunk_record = Chunk(
            id=chunk_id,
            source_id=source_id,
            standard_id=standard_id,
            text=chunk_text,
            qdrant_point_id=qdrant_point_id,
            chunk_index=chunk_index
        )
        chunk_records.append(chunk_record)

    # 3. Write points to Qdrant asynchronously
    logger.info(f"Upserting vectors into Qdrant collection '{qdrant_manager.collection_name}'")
    await qdrant_manager.async_client.upsert(
        collection_name=qdrant_manager.collection_name,
        points=points
    )

    # 4. Write Chunk rows to Postgres
    logger.info(f"Persisting {len(chunk_records)} Chunk rows to PostgreSQL database")
    for record in chunk_records:
        await chunk_repo.create(record)
        
    return len(chunks_data)
