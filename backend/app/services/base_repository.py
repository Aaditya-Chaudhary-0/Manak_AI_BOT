from typing import TypeVar, Generic, Type, Optional, Sequence, Any, Dict, Union
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

T = TypeVar("T")


class BaseRepository(Generic[T]):
    """
    Generic Base Repository that provides common database CRUD operations.
    Inherited by specific repositories to encapsulate database query logic.
    """
    def __init__(self, model: Type[T], db: AsyncSession) -> None:
        self.model = model
        self.db = db

    async def get_by_id(self, id: Any) -> Optional[T]:
        """
        Retrieves a single record by its primary key ID.
        """
        result = await self.db.execute(select(self.model).filter_by(id=id))
        return result.scalar_one_or_none()

    async def list(self, skip: int = 0, limit: int = 100) -> Sequence[T]:
        """
        Retrieves a paginated list of records.
        """
        result = await self.db.execute(select(self.model).offset(skip).limit(limit))
        return result.scalars().all()

    async def create(self, obj_in: T) -> T:
        """
        Adds a new record to the session.
        """
        self.db.add(obj_in)
        await self.db.flush()
        return obj_in

    async def update(self, db_obj: T, obj_in: Union[Dict[str, Any], T]) -> T:
        """
        Updates an existing record with new data.
        Accepts either a dictionary or a model object instance.
        """
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            # Extract dictionary of model columns from the object
            update_data = {
                col.key: getattr(obj_in, col.key)
                for col in self.model.__table__.columns
                if hasattr(obj_in, col.key)
            }

        for field in update_data:
            if hasattr(db_obj, field) and field != "id":
                setattr(db_obj, field, update_data[field])

        self.db.add(db_obj)
        await self.db.flush()
        return db_obj

    async def delete(self, id: Any) -> bool:
        """
        Deletes a record by its ID. Returns True if successfully deleted.
        """
        db_obj = await self.get_by_id(id)
        if db_obj:
            await self.db.delete(db_obj)
            await self.db.flush()
            return True
        return False

    async def exists(self, id: Any) -> bool:
        """
        Checks if a record with the specified ID exists in the database.
        """
        result = await self.db.execute(
            select(1).select_from(self.model).filter_by(id=id).limit(1)
        )
        return result.scalar() is not None
