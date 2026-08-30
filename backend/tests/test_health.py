import pytest
from fastapi import status
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_health_check():
    """
    Test that the GET /health endpoint returns HTTP 200 and indicates that
    both the database and Qdrant connections are functional.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/health")
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert data["status"] == "healthy" or data["status"] == "ok"
        assert data["database"] == "connected" or data["database"] == "ok"
        assert data["qdrant"] == "connected" or data["qdrant"] == "ok"


@pytest.mark.asyncio
async def test_api_health_check():
    """
    Test that GET /api/health also works.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/health")
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert data["status"] == "healthy" or data["status"] == "ok"
        assert data["database"] == "connected" or data["database"] == "ok"
        assert data["qdrant"] == "connected" or data["qdrant"] == "ok"
