from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from app.config import settings

# Declare the SQLAlchemy Declarative Base
class Base(DeclarativeBase):
    """
    Base class for all SQLAlchemy ORM models.
    """
    pass

# Create the async database engine using the postgresql+asyncpg driver
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True if settings.ENV == "development" else False,
    future=True
)

# Async session factory
AsyncSessionFactory = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)
