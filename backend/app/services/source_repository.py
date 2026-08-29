from typing import Optional, Sequence, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models.source import Source, Chunk
from app.services.base_repository import BaseRepository


class SourceRepository(BaseRepository[Source]):
    """
    Repository class for the Source entity. Handles source-specific queries.
    """
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(Source, db)


class ChunkRepository(BaseRepository[Chunk]):
    """
    Repository class for the Chunk entity. Handles chunk-specific queries.
    """
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(Chunk, db)

    async def get_by_qdrant_point_id(self, qdrant_point_id: Any) -> Optional[Chunk]:
        """
        Retrieves a chunk by its corresponding Qdrant Vector Point ID.
        """
        result = await self.db.execute(
            select(Chunk).filter_by(qdrant_point_id=qdrant_point_id)
        )
        return result.scalar_one_or_none()

    async def list_by_source_id(self, source_id: Any, skip: int = 0, limit: int = 100) -> Sequence[Chunk]:
        """
        Retrieves chunks belonging to a specific Source.
        """
        result = await self.db.execute(
            select(Chunk)
            .filter_by(source_id=source_id)
            .options(selectinload(Chunk.source))
            .order_by(Chunk.chunk_index)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    async def list_by_standard_id(self, standard_id: Any, skip: int = 0, limit: int = 100) -> Sequence[Chunk]:
        """
        Retrieves chunks mapping to a specific Standard.
        """
        result = await self.db.execute(
            select(Chunk)
            .filter_by(standard_id=standard_id)
            .order_by(Chunk.chunk_index)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    async def delete_by_source_id(self, source_id: Any) -> None:
        """
        Deletes all chunks belonging to a specific source_id.
        """
        from sqlalchemy import delete
        await self.db.execute(delete(Chunk).filter_by(source_id=source_id))
        await self.db.flush()
