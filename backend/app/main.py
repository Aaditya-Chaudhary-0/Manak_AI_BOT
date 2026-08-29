import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy import text

from app.config import settings, setup_logging
from app.database import engine, AsyncSessionFactory
from app.qdrant_client import qdrant_manager
from app.routers import health

# Setup application logging
setup_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan events for FastAPI.
    Startup: Verifies PostgreSQL and Qdrant connections.
    Shutdown: Safely disposes database engines.
    """
    logger.info("Starting up ManakAI application...")
    
    # 1. Database connectivity check
    try:
        async with AsyncSessionFactory() as session:
            await session.execute(text("SELECT 1"))
        logger.info("Database connection verified successfully.")
    except Exception as e:
        logger.critical(f"DATABASE CONNECTION VERIFICATION FAILED: {e}")
    
    # 2. Qdrant connectivity check
    try:
        qdrant_healthy = await qdrant_manager.check_health_async()
        if qdrant_healthy:
            logger.info("Qdrant connection verified successfully.")
        else:
            logger.critical("QDRANT CONNECTION VERIFICATION FAILED (Ping returned False).")
    except Exception as e:
        logger.critical(f"QDRANT CONNECTION VERIFICATION FAILED with exception: {e}")

    yield

    logger.info("Shutting down ManakAI application...")
    # Safe cleanup of SQLAlchemy engine
    await engine.dispose()
    logger.info("Database engine connections disposed successfully.")


# Instantiate FastAPI application
app = FastAPI(
    title="ManakAI Backend API",
    description="Intelligent Assistant for Indian Standards and BIS Services",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"] if settings.ENV == "development" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Global Exception Handlers (Standardized Error Shapes) ---

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Handles request validation errors (HTTP 422) and returns the standard error shape.
    """
    logger.warning(f"Validation error for path {request.url.path}: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": "validation_error",
                "message": "Validation failed for request payload.",
                "details": exc.errors()
            }
        }
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """
    Handles standard HTTP exceptions and returns the standard error shape.
    """
    # Map common status codes to error codes
    code_map = {
        status.HTTP_400_BAD_REQUEST: "bad_request",
        status.HTTP_401_UNAUTHORIZED: "unauthenticated",
        status.HTTP_403_FORBIDDEN: "unauthorized",
        status.HTTP_404_NOT_FOUND: "not_found",
        status.HTTP_409_CONFLICT: "conflict",
        status.HTTP_503_SERVICE_UNAVAILABLE: "service_unavailable"
    }
    
    error_code = code_map.get(exc.status_code, "error")
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": getattr(exc, "code", error_code),
                "message": exc.detail
            }
        }
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    """
    Catch-all exception handler to avoid leaking raw exceptions (HTTP 500).
    """
    logger.exception(f"Unhandled server error on path {request.url.path}: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "internal_error",
                "message": "Something went wrong."
            }
        }
    )


# --- Router Registration ---

# Mount health check endpoint under root and /api
app.include_router(health.router)
app.include_router(health.router, prefix="/api")
