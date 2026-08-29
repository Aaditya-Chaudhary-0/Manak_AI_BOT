from typing import Optional, Sequence, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from app.models.standard import Standard, StandardRelation
from app.services.base_repository import BaseRepository


class StandardRepository(BaseRepository[Standard]):
    """
    Repository class for the Standard entity. Handles standard-specific queries.
    """
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(Standard, db)

    async def get_by_code(self, code: str) -> Optional[Standard]:
        """
        Retrieves a standard by its unique code (e.g. 'IS 16101').
        """
        result = await self.db.execute(select(Standard).filter_by(code=code))
        return result.scalar_one_or_none()

    async def search_by_text(self, query_text: str, limit: int = 20) -> Sequence[Standard]:
        """
        Performs full-text keyword search using PostgreSQL plainto_tsquery against
        the computed search_vector column.
        """
        # Convert plain search text to a plain tsquery
        tsquery = func.plainto_tsquery("english", query_text)
        
        # Select standards matching the query, ordering by ts_rank
        stmt = (
            select(Standard)
            .filter(Standard.search_vector.op("@@")(tsquery))
            .order_by(func.ts_rank(Standard.search_vector, tsquery).desc())
            .limit(limit)
        )
        
        result = await self.db.execute(stmt)
        return result.scalars().all()


class StandardRelationRepository(BaseRepository[StandardRelation]):
    """
    Repository class for the StandardRelation entity. Handles relationships between standards.
    """
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(StandardRelation, db)

    async def add_relation(
        self, standard_id: Any, related_standard_id: Any, relation_type: str = "related"
    ) -> StandardRelation:
        """
        Creates a new relation between standard_id and related_standard_id.
        """
        relation = StandardRelation(
            standard_id=standard_id,
            related_standard_id=related_standard_id,
            relation_type=relation_type
        )
        return await self.create(relation)

    async def list_relations(self, standard_id: Any) -> Sequence[StandardRelation]:
        """
        Lists all relations associated with a standard (where it is either standard or related standard).
        """
        stmt = select(StandardRelation).filter(
            or_(
                StandardRelation.standard_id == standard_id,
                StandardRelation.related_standard_id == standard_id
            )
        )
        result = await self.db.execute(stmt)
        return result.scalars().all()
