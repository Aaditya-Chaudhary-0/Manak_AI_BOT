from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import AsyncSessionFactory

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency that yields an AsyncSession for database operations.
    The session is automatically closed after the request is finished.
    """
    async with AsyncSessionFactory() as session:
        yield session
