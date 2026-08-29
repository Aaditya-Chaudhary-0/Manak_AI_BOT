import os
import pytest
from typing import AsyncGenerator
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.pool import NullPool

# Set ENV to testing before importing settings
os.environ["ENV"] = "testing"
# Disable verbose SQLAlchemy logging during tests
os.environ["LOG_LEVEL"] = "warning"

from app.main import app
from app.config import settings

# Create a test-specific engine with NullPool to avoid event loop reuse issues
test_engine = create_async_engine(
    settings.DATABASE_URL,
    poolclass=NullPool
)


@pytest.fixture(scope="module")
def client() -> TestClient:
    """
    Fixture providing a test client for the FastAPI application.
    """
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Fixture providing a database session that runs within a transaction
    on a dedicated connection (using NullPool) and rolls back after the test completes.
    This prevents 'Event loop is closed' and 'another operation in progress' errors.
    """
    connection = await test_engine.connect()
    transaction = await connection.begin()
    
    # Create an AsyncSession bound to this connection
    session = AsyncSession(bind=connection, expire_on_commit=False)
    
    try:
        yield session
    finally:
        await session.close()
        await transaction.rollback()
        await connection.close()
