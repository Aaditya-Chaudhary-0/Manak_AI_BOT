from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User
from app.services.base_repository import BaseRepository


class UserRepository(BaseRepository[User]):
    """
    Repository class for the User entity. Handles user-specific database queries.
    """
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(User, db)

    async def get_by_email(self, email: str) -> Optional[User]:
        """
        Retrieves a user record by their unique email.
        """
        result = await self.db.execute(select(User).filter_by(email=email))
        return result.scalar_one_or_none()
