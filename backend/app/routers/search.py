import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db
from app.schemas.search import SearchRequest, SearchResponse
from app.services.retrieval_service import retrieval_service

logger = logging.getLogger(__name__)

router = APIRouter(tags=["search"])


@router.post(
    "/search",
    response_model=SearchResponse,
    status_code=status.HTTP_200_OK,
    summary="Perform hybrid retrieval search over the indexed BIS corpus"
)
async def search_corpus(
    payload: SearchRequest,
    db: AsyncSession = Depends(get_db)
) -> SearchResponse:
    """
    POST /search or /api/search endpoint.
    Delegates hybrid retrieval execution to retrieval_service.
    """
    try:
        response = await retrieval_service.search(
            db=db,
            query=payload.query,
            language=payload.language or "en",
            top_k=payload.top_k or 5
        )
        return response
    except Exception as e:
        logger.error(f"Error executing hybrid search for query '{payload.query}': {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Retrieval engine or database is temporarily unavailable."
        )
