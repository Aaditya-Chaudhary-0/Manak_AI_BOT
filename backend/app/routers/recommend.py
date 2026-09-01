import logging
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import AsyncSessionFactory
from app.schemas.standard import RecommendationRequest, RecommendationResponse, RecommendationItem
from app.services.retrieval_service import retrieval_service

logger = logging.getLogger(__name__)

router = APIRouter(
    tags=["Product Recommendation"]
)


async def get_db() -> AsyncSession:
    """
    Dependency that yields an AsyncSession for database operations.
    """
    async with AsyncSessionFactory() as session:
        yield session


@router.post(
    "/recommend",
    response_model=RecommendationResponse,
    status_code=status.HTTP_200_OK,
    summary="Match product specifications against relevant mandatory BIS standards"
)
async def recommend_standards(
    req: RecommendationRequest,
    db: AsyncSession = Depends(get_db)
) -> RecommendationResponse:
    """
    Constructs a composite search query from product_name, industry, and description,
    executes hybrid retrieval against official BIS standards, and returns ranked recommendations.
    """
    query_parts = [req.product_name]
    if req.industry and req.industry.strip():
        query_parts.append(req.industry.strip())
    if req.description and req.description.strip():
        query_parts.append(req.description.strip())
        
    composite_query = " ".join(query_parts).strip()
    logger.info(f"Generating product standard recommendations for: '{composite_query}'")

    # Reuse existing hybrid retrieval engine
    search_res = await retrieval_service.search(db=db, query=composite_query, top_k=5)

    recommendations = []
    if not search_res.abstained and search_res.results:
        for res in search_res.results:
            recommendations.append(
                RecommendationItem(
                    standard_code=res.standard_code or res.title,
                    title=res.title,
                    confidence=res.confidence,
                    reason=f"Matched product requirements for '{req.product_name}' ({res.confidence} confidence match).",
                    score=res.score,
                    source_url=res.source_url
                )
            )

    return RecommendationResponse(
        query=composite_query,
        recommendations=recommendations
    )
