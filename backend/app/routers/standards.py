import logging
from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import AsyncSessionFactory
from app.schemas.standard import StandardsSearchResponse, StandardDetail
from app.services.standard_catalog_service import StandardCatalogService

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/standards",
    tags=["Standards Catalog"]
)


async def get_db() -> AsyncSession:
    """
    Dependency that yields an AsyncSession for database operations.
    """
    async with AsyncSessionFactory() as session:
        yield session


@router.get(
    "/search",
    response_model=StandardsSearchResponse,
    status_code=status.HTTP_200_OK,
    summary="Search standards catalog with full-text query and pagination"
)
@router.get(
    "",
    response_model=StandardsSearchResponse,
    status_code=status.HTTP_200_OK,
    summary="List standards catalog with pagination"
)
async def search_standards(
    q: Optional[str] = Query(None, description="Optional search query string for full-text search"),
    limit: int = Query(10, ge=1, le=100, description="Maximum number of standards to return"),
    offset: int = Query(0, ge=0, description="Offset index for pagination"),
    db: AsyncSession = Depends(get_db)
) -> StandardsSearchResponse:
    """
    Executes full-text search against PostgreSQL search_vector if `q` is provided.
    If `q` is empty or missing, returns paginated standards ordered by standard code.
    """
    service = StandardCatalogService(db)
    return await service.search_standards(query=q, limit=limit, offset=offset)


@router.get(
    "/{id}",
    response_model=StandardDetail,
    status_code=status.HTTP_200_OK,
    summary="Get complete metadata and relations for a single standard"
)
async def get_standard_detail(
    id: str,
    db: AsyncSession = Depends(get_db)
) -> StandardDetail:
    """
    Retrieves standard metadata by UUID or standard code (e.g. 'IS 10500').
    Returns HTTP 404 if no standard matches the identifier.
    """
    service = StandardCatalogService(db)
    detail = await service.get_standard_detail(id)
    if not detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Standard '{id}' not found."
        )
    return detail
