from typing import Sequence, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models.audit import AuditLog
from app.services.base_repository import BaseRepository


class AuditLogRepository(BaseRepository[AuditLog]):
    """
    Repository class for the AuditLog entity. Handles system audit trail queries.
    """
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(AuditLog, db)

    async def list_by_actor_id(self, actor_id: Any, skip: int = 0, limit: int = 100) -> Sequence[AuditLog]:
        """
        Retrieves paginated audit logs triggered by a specific user.
        """
        result = await self.db.execute(
            select(AuditLog)
            .filter_by(actor_id=actor_id)
            .options(selectinload(AuditLog.actor))
            .order_by(AuditLog.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    async def list_by_action(self, action: str, skip: int = 0, limit: int = 100) -> Sequence[AuditLog]:
        """
        Retrieves paginated audit logs matching a specific action (e.g. 'source.reindex').
        """
        result = await self.db.execute(
            select(AuditLog)
            .filter_by(action=action)
            .order_by(AuditLog.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()
