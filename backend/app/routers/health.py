import logging
from fastapi import APIRouter, Depends, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.dependencies import get_db
from app.qdrant_client import qdrant_manager

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/health")
async def health_check(response: Response, db: AsyncSession = Depends(get_db)):
    """
    Health check endpoint verifying connection status for PostgreSQL and Qdrant.
    Returns HTTP 200 if both are healthy, otherwise HTTP 503 Service Unavailable.
    """
    database_ok = "ok"
    qdrant_ok = "ok"
    status_code = status.HTTP_200_OK

    # 1. Verify PostgreSQL Database connection
    try:
        await db.execute(text("SELECT 1"))
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        database_ok = "error"
        status_code = status.HTTP_503_SERVICE_UNAVAILABLE

    # 2. Verify Qdrant connection
    try:
        qdrant_status = await qdrant_manager.check_health_async()
        if not qdrant_status:
            qdrant_ok = "error"
            status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    except Exception as e:
        logger.error(f"Qdrant health check failed: {e}")
        qdrant_ok = "error"
        status_code = status.HTTP_503_SERVICE_UNAVAILABLE

    response.status_code = status_code
    
    return {
        "status": "ok" if status_code == status.HTTP_200_OK else "error",
        "database": database_ok,
        "qdrant": qdrant_ok
    }
