import json
import os
import pytest
from sqlalchemy import select

from scripts.seed_database import seed_data
from app.models.standard import Standard
from app.models.source import Source, Chunk
from app.services.standard_repository import StandardRepository
from app.services.source_repository import SourceRepository, ChunkRepository
from app.qdrant_client import qdrant_manager


def test_json_structure():
    """
    Unit test: Verifies that data/manual_seed.json exists, is valid JSON, and contains required fields.
    """
    json_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "manual_seed.json")
    assert os.path.exists(json_path), "data/manual_seed.json must exist"

    with open(json_path, "r", encoding="utf-8") as f:
        items = json.load(f)

    assert isinstance(items, list), "Seed data must be a JSON array"
    assert len(items) >= 10, "Seed data should contain all curated entries from MANUAL_SEED_DATA.md"

    for item in items:
        assert "title" in item
        assert "url" in item
        assert "source_type" in item
        assert "chunk" in item
        assert "scope" in item


@pytest.mark.asyncio
async def test_seed_database_execution_and_idempotency(db_session):
    """
    Integration test: Runs seed_data(), verifies DB and Qdrant population, then runs it again to assert idempotency.
    """
    # 1. First execution: should insert or update records
    metrics_run1 = await seed_data()

    assert metrics_run1["Errors"] == 0
    assert (metrics_run1["Inserted Sources"] + metrics_run1["Updated Sources"]) > 0
    assert (metrics_run1["Inserted Chunks"] + metrics_run1["Updated Chunks"]) > 0
    assert metrics_run1["Embedded"] > 0

    # 2. Verify PostgreSQL population using repositories
    standard_repo = StandardRepository(db_session)
    source_repo = SourceRepository(db_session)
    chunk_repo = ChunkRepository(db_session)

    # Check specific standard IS 10500
    is10500 = await standard_repo.get_by_code("IS 10500")
    assert is10500 is not None
    assert "Drinking Water" in is10500.title

    # Check chunks exist
    chunks = await chunk_repo.list_by_standard_id(is10500.id)
    assert len(chunks) > 0
    assert chunks[0].qdrant_point_id is not None

    # 3. Verify Qdrant points exist
    import asyncio
    qdrant_point_id_str = str(chunks[0].qdrant_point_id)
    retrieved_points = await asyncio.to_thread(
        qdrant_manager.client.retrieve,
        collection_name=qdrant_manager.collection_name,
        ids=[qdrant_point_id_str]
    )
    assert len(retrieved_points) == 1
    assert retrieved_points[0].payload["text"] == chunks[0].text

    # 4. Second execution: should update/skip records with ZERO new inserts (Idempotency)
    metrics_run2 = await seed_data()

    assert metrics_run2["Errors"] == 0
    assert metrics_run2["Inserted Sources"] == 0
    assert metrics_run2["Inserted Standards"] == 0
    assert metrics_run2["Inserted Chunks"] == 0
    assert metrics_run2["Updated Sources"] > 0
