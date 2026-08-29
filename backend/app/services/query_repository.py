from typing import Optional, Sequence, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.query import Query, Result, Feedback
from app.services.base_repository import BaseRepository


class QueryRepository(BaseRepository[Query]):
    """
    Repository class for the Query entity. Handles user query history operations.
    """
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(Query, db)

    async def list_by_user_id(self, user_id: Any, skip: int = 0, limit: int = 100) -> Sequence[Query]:
        """
        Retrieves paginated queries for a specific user.
        """
        result = await self.db.execute(
            select(Query)
            .filter_by(user_id=user_id)
            .order_by(Query.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()


class ResultRepository(BaseRepository[Result]):
    """
    Repository class for the Result entity. Handles query search results metadata.
    """
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(Result, db)

    async def list_by_query_id(self, query_id: Any) -> Sequence[Result]:
        """
        Retrieves all search result records associated with a given query.
        """
        result = await self.db.execute(
            select(Result)
            .filter_by(query_id=query_id)
            .order_by(Result.rank)
        )
        return result.scalars().all()


class FeedbackRepository(BaseRepository[Feedback]):
    """
    Repository class for the Feedback entity. Handles user rating/reason submissions.
    """
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(Feedback, db)

    async def get_by_result_id(self, result_id: Any) -> Optional[Feedback]:
        """
        Retrieves user feedback submitted for a specific search result card.
        """
        result = await self.db.execute(select(Feedback).filter_by(result_id=result_id))
        return result.scalar_one_or_none()

    async def list_all_feedbacks(self, skip: int = 0, limit: int = 100) -> Sequence[Feedback]:
        """
        Retrieves a paginated list of all feedbacks (for admin curation/review).
        """
        result = await self.db.execute(
            select(Feedback)
            .order_by(Feedback.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()
