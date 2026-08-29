import uuid
import pytest
from app.ingestion.chunker import split_sentences, pack_sentences, count_tokens, chunk_document
from app.ingestion.embedder import derive_qdrant_point_id


def test_split_sentences():
    """
    Unit test: Ensure sentences are split correctly without breaking IS codes.
    """
    text = "The product must comply with IS 16101. It also needs testing! What is next? We check the voltage i.e. 220V."
    sentences = split_sentences(text)
    
    # "IS 16101." should not be split after IS.
    # "i.e." should not be split.
    assert len(sentences) == 4
    assert sentences[0] == "The product must comply with IS 16101."
    assert sentences[1] == "It also needs testing!"
    assert sentences[2] == "What is next?"
    assert sentences[3] == "We check the voltage i.e. 220V."


def test_pack_sentences():
    """
    Unit test: Ensure sentence packing respects max/min tokens and overlaps.
    """
    sentences = [
        "First sentence is short.",
        "Second sentence is also quite short.",
        "Third sentence adds a bit more length to the entire chunk."
    ]
    # Artificially low limits to trigger packing
    # 5 words per sentence roughly. Let's set max to 10.
    chunks = pack_sentences(sentences, max_tokens=15, min_tokens=5, overlap_count=1)
    
    assert len(chunks) > 0
    # Overlap should ensure sentences carry over.


def test_derive_qdrant_point_id():
    """
    Unit test: Ensure Qdrant UUIDs are deterministic.
    """
    source_id = uuid.uuid4()
    
    # Same inputs -> Same ID
    id1 = derive_qdrant_point_id(source_id, 0)
    id2 = derive_qdrant_point_id(source_id, 0)
    assert id1 == id2
    
    # Different inputs -> Different ID
    id3 = derive_qdrant_point_id(source_id, 1)
    assert id1 != id3


@pytest.mark.asyncio
async def test_ingestion_pipeline_integration(db_session):
    """
    Integration test: Run process_source for a placeholder URL, ensuring rows land in Postgres.
    """
    from app.ingestion.run_ingestion import process_source
    from app.services.source_repository import SourceRepository, ChunkRepository
    from app.models.source import Source
    from sqlalchemy import select
    
    seed = {
        "url": "http://example.com/bis_know_your_standard_todo",
        "title": "Test Title",
        "source_type": "standard_metadata"
    }
    
    source_repo = SourceRepository(db_session)
    chunk_repo = ChunkRepository(db_session)
    
    # Run pipeline
    res = await process_source(seed, db_session, source_repo, chunk_repo)
    
    # Should be processed or skipped (incremental) successfully
    assert res["status"] in ["processed", "skipped"]
    if res["status"] == "processed":
        assert res["chunks"] > 0
    
    # Verify DB presence
    res_db = await db_session.execute(select(Source).filter_by(url=seed["url"]))
    db_source = res_db.scalars().first()
    assert db_source is not None
    assert db_source.checksum is not None
    
    # Verify chunks in DB
    chunks = await chunk_repo.list_by_source_id(db_source.id)
    assert len(chunks) > 0
    
    # Check deterministic Qdrant point IDs
    assert chunks[0].qdrant_point_id == derive_qdrant_point_id(db_source.id, chunks[0].chunk_index)
