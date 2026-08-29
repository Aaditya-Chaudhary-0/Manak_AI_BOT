import pytest
import uuid
from datetime import datetime, date
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select

from app.models.user import User
from app.models.source import Source, Chunk
from app.models.standard import Standard, StandardRelation
from app.models.query import Query, Result, Feedback
from app.models.audit import AuditLog

from app.services.user_repository import UserRepository
from app.services.source_repository import SourceRepository, ChunkRepository
from app.services.standard_repository import StandardRepository, StandardRelationRepository
from app.services.query_repository import QueryRepository, ResultRepository, FeedbackRepository
from app.services.audit_repository import AuditLogRepository


@pytest.mark.asyncio
async def test_user_repository(db_session):
    """
    Tests UserRepository operations: create, get_by_id, get_by_email, list, exists, delete.
    """
    repo = UserRepository(db_session)
    
    # Test Create
    new_user = User(
        name="John Doe",
        email="john@example.com",
        password_hash="hashedpassword123",
        role="user",
        preferred_language="en"
    )
    user = await repo.create(new_user)
    assert user.id is not None
    assert user.name == "John Doe"
    assert user.email == "john@example.com"
    
    # Test Get by ID
    fetched_user = await repo.get_by_id(user.id)
    assert fetched_user is not None
    assert fetched_user.id == user.id
    
    # Test Get by Email
    email_user = await repo.get_by_email("john@example.com")
    assert email_user is not None
    assert email_user.id == user.id
    
    # Test Exists
    assert await repo.exists(user.id) is True
    assert await repo.exists(uuid.uuid4()) is False
    
    # Test List
    users = await repo.list()
    assert len(users) >= 1
    
    # Test Delete
    deleted = await repo.delete(user.id)
    assert deleted is True
    assert await repo.get_by_id(user.id) is None


@pytest.mark.asyncio
async def test_source_chunk_cascade(db_session):
    """
    Tests Source and Chunk ORM models, relationships, and CASCADE delete rules.
    """
    source_repo = SourceRepository(db_session)
    chunk_repo = ChunkRepository(db_session)
    
    # 1. Create Source
    source = Source(
        title="BIS LED Bulb Standard Doc",
        url="https://bis.gov.in/led-doc.pdf",
        source_type="standard_page",
        checksum="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        indexed_at=datetime.utcnow()
    )
    await source_repo.create(source)
    assert source.id is not None

    # 2. Create Chunks linked to Source
    qdrant_uuid_1 = uuid.uuid4()
    chunk1 = Chunk(
        source_id=source.id,
        text="This is standard specification paragraph 1 details.",
        qdrant_point_id=qdrant_uuid_1,
        chunk_index=0
    )
    chunk2 = Chunk(
        source_id=source.id,
        text="This is standard specification paragraph 2 details.",
        qdrant_point_id=uuid.uuid4(),
        chunk_index=1
    )
    await chunk_repo.create(chunk1)
    await chunk_repo.create(chunk2)

    # Verify chunks relations
    chunks = await chunk_repo.list_by_source_id(source.id)
    assert len(chunks) == 2
    assert chunks[0].qdrant_point_id == qdrant_uuid_1
    assert chunks[0].source.title == "BIS LED Bulb Standard Doc"

    # Test Cascade Delete: deleting source must delete all chunks linked to it
    await source_repo.delete(source.id)
    
    # Verify chunks are deleted
    chunks_after_delete = await chunk_repo.list_by_source_id(source.id)
    assert len(chunks_after_delete) == 0


@pytest.mark.asyncio
async def test_standard_and_relations(db_session):
    """
    Tests Standard and StandardRelation models, uniqueness constraints, and get_by_code.
    """
    std_repo = StandardRepository(db_session)
    rel_repo = StandardRelationRepository(db_session)
    
    # 1. Create Standards
    std1 = Standard(
        code="IS 16101",
        title="General Lighting Requirements",
        scope="General lighting",
        status="Active",
        version="2023",
        last_updated=date(2023, 5, 10)
    )
    std2 = Standard(
        code="IS 16102",
        title="Self-ballasted LED lamps",
        scope="Safety requirements",
        status="Active",
        version="2024",
        last_updated=date(2024, 1, 15)
    )
    await std_repo.create(std1)
    await std_repo.create(std2)

    # 2. Add Relation
    relation = await rel_repo.add_relation(
        standard_id=std1.id,
        related_standard_id=std2.id,
        relation_type="supersedes"
    )
    assert relation.id is not None
    
    # Verify listing relations
    relations = await rel_repo.list_relations(std1.id)
    assert len(relations) == 1
    assert relations[0].relation_type == "supersedes"

    # 3. Test uniqueness constraint on standard_relations pair
    duplicate_relation = StandardRelation(
        standard_id=std1.id,
        related_standard_id=std2.id,
        relation_type="related"
    )
    db_session.add(duplicate_relation)
    with pytest.raises(IntegrityError):
        await db_session.flush()
    await db_session.rollback()


@pytest.mark.asyncio
async def test_standard_search_vector_tsvector(db_session):
    """
    Tests PostgreSQL computed search_vector functionality using GIN full-text index.
    """
    std_repo = StandardRepository(db_session)
    
    # Create Standard containing specific terms
    std = Standard(
        code="IS 9999",
        title="Luminaires for road and street lighting",
        scope="Covers outdoor lighting poles and bracket mounts",
        status="Active",
        version="2025"
    )
    await std_repo.create(std)
    
    # Flush session to compute and populate search_vector column in DB
    await db_session.flush()

    # Search for standard using tsvector matching
    matches = await std_repo.search_by_text("road lighting")
    assert len(matches) >= 1
    assert matches[0].code == "IS 9999"

    # Search for standard using scope term
    scope_matches = await std_repo.search_by_text("poles")
    assert len(scope_matches) >= 1
    assert scope_matches[0].code == "IS 9999"


@pytest.mark.asyncio
async def test_query_result_feedback(db_session):
    """
    Tests Query, Result, Feedback ORM structure, relationships, and cascades.
    """
    user_repo = UserRepository(db_session)
    source_repo = SourceRepository(db_session)
    chunk_repo = ChunkRepository(db_session)
    query_repo = QueryRepository(db_session)
    result_repo = ResultRepository(db_session)
    feedback_repo = FeedbackRepository(db_session)
    
    # Setup dependencies
    user = User(name="Tester", email="test@example.com", password_hash="pass")
    await user_repo.create(user)
    
    source = Source(title="Doc", url="http://x", source_type="faq")
    await source_repo.create(source)
    
    chunk = Chunk(source_id=source.id, text="retrieved content", qdrant_point_id=uuid.uuid4(), chunk_index=0)
    await chunk_repo.create(chunk)
    
    # 1. Create Query record
    query = Query(
        user_id=user.id,
        text="What is the testing requirement for LED?",
        query_type="search",
        language="en",
        abstained=False,
        latency_ms=120
    )
    await query_repo.create(query)
    
    # 2. Add Result card linked to query
    result = Result(
        query_id=query.id,
        chunk_id=chunk.id,
        score=0.88,
        confidence="High",
        rank=1
    )
    await result_repo.create(result)
    
    # 3. Add Feedback
    fb = Feedback(
        result_id=result.id,
        user_id=user.id,
        rating="helpful",
        reason="Exactly matched LED requirement."
    )
    await feedback_repo.create(fb)

    # Verify mappings
    history = await query_repo.list_by_user_id(user.id)
    assert len(history) == 1
    assert history[0].text == "What is the testing requirement for LED?"

    results = await result_repo.list_by_query_id(query.id)
    assert len(results) == 1
    assert results[0].score == 0.88

    feedback_fb = await feedback_repo.get_by_result_id(result.id)
    assert feedback_fb is not None
    assert feedback_fb.rating == "helpful"


@pytest.mark.asyncio
async def test_audit_log_metadata(db_session):
    """
    Tests AuditLog mapping, user actor relations, and JSONB meta field storage.
    """
    user_repo = UserRepository(db_session)
    audit_repo = AuditLogRepository(db_session)
    
    actor = User(name="Admin User", email="admin@example.com", password_hash="adminpass", role="admin")
    await user_repo.create(actor)
    
    meta_payload = {"ip_address": "127.0.0.1", "source_file": "led.pdf"}
    log = AuditLog(
        actor_id=actor.id,
        action="source.reindex",
        object_type="source",
        object_id=uuid.uuid4(),
        meta=meta_payload
    )
    await audit_repo.create(log)
    
    # Retrieve audit log
    logs = await audit_repo.list_by_actor_id(actor.id)
    assert len(logs) == 1
    assert logs[0].action == "source.reindex"
    assert logs[0].meta["ip_address"] == "127.0.0.1"
    assert logs[0].actor.name == "Admin User"
