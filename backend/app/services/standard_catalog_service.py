import uuid
from typing import Optional, List, Sequence
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from sqlalchemy.orm import selectinload

from app.models.standard import Standard, StandardRelation
from app.schemas.standard import (
    StandardSummary,
    StandardDetail,
    StandardSourceInfo,
    RelatedStandardItem,
    StandardsSearchResponse
)

class StandardCatalogService:
    """
    Service layer handling standards catalog queries,
    pagination, detail retrieval, and related standards.
    """

    def __init__(self, db: AsyncSession):
        self.db = db

    async def search_standards(
        self,
        query: Optional[str] = None,
        limit: int = 10,
        offset: int = 0,
    ) -> StandardsSearchResponse:

        if query and query.strip():

            query_clean = query.strip()
            tsquery = func.plainto_tsquery("english", query_clean)

            search_filter = or_(
                Standard.code.ilike(f"%{query_clean}%"),
                Standard.title.ilike(f"%{query_clean}%"),
                Standard.scope.ilike(f"%{query_clean}%"),
                Standard.search_vector.op("@@")(tsquery),
            )

            count_stmt = (
                select(func.count(Standard.id))
                .where(search_filter)
            )

            total = (await self.db.execute(count_stmt)).scalar() or 0

            rank = func.ts_rank(Standard.search_vector, tsquery)

            stmt = (
                select(Standard)
                .where(search_filter)
                .order_by(
                    rank.desc(),
                    Standard.code.asc(),
                )
                .limit(limit)
                .offset(offset)
            )

        else:

            count_stmt = select(func.count(Standard.id))
            total = (await self.db.execute(count_stmt)).scalar() or 0

            stmt = (
                select(Standard)
                .order_by(Standard.code.asc())
                .limit(limit)
                .offset(offset)
            )

        res = await self.db.execute(stmt)

        standards = res.scalars().all()

        return StandardsSearchResponse(
            total=total,
            limit=limit,
            offset=offset,
            results=[
                StandardSummary.model_validate(s)
                for s in standards
            ],
        )

    async def get_standard_detail(
        self,
        identifier: str,
    ) -> Optional[StandardDetail]:

        try:
            uid = uuid.UUID(identifier)

            stmt = (
                select(Standard)
                .options(selectinload(Standard.source))
                .where(Standard.id == uid)
            )

        except ValueError:

            stmt = (
                select(Standard)
                .options(selectinload(Standard.source))
                .where(Standard.code == identifier.strip())
            )

        res = await self.db.execute(stmt)

        std = res.scalar_one_or_none()

        if std is None:
            return None

        source_info = (
            StandardSourceInfo.model_validate(std.source)
            if std.source
            else None
        )

        rel_stmt = (
            select(StandardRelation)
            .options(
                selectinload(StandardRelation.standard),
                selectinload(StandardRelation.related_standard),
            )
            .where(
                or_(
                    StandardRelation.standard_id == std.id,
                    StandardRelation.related_standard_id == std.id,
                )
            )
        )

        rel_res = await self.db.execute(rel_stmt)

        relations = rel_res.scalars().all()

        related_items: List[RelatedStandardItem] = []

        for relation in relations:

            related = (
                relation.related_standard
                if relation.standard_id == std.id
                else relation.standard
            )

            if related is None:
                continue

            related_items.append(
                RelatedStandardItem(
                    id=related.id,
                    code=related.code,
                    title=related.title,
                    relation_type=relation.relation_type or "related",
                )
            )

        return StandardDetail(
            id=std.id,
            code=std.code,
            title=std.title,
            status=std.status,
            version=std.version,
            scope=std.scope,
            source=source_info,
            related_standards=related_items,
            last_updated=std.last_updated,
            created_at=std.created_at,
        )