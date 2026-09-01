import pytest
from fastapi import status
from httpx import AsyncClient, ASGITransport

from app.main import app


@pytest.mark.asyncio
async def test_recommend_standards_success():
    """
    Integration test: POST /api/recommend with valid product payload.
    Verifies 200 response, schema conformity, and recommendation list output.
    """
    payload = {
        "product_name": "LED Bulb",
        "industry": "Lighting",
        "description": "Self-ballasted LED lamps for general indoor lighting services"
    }

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post("/api/recommend", json=payload)
        assert response.status_code == status.HTTP_200_OK

        data = response.json()
        assert "query" in data
        assert "recommendations" in data
        assert isinstance(data["recommendations"], list)
        if len(data["recommendations"]) > 0:
            rec = data["recommendations"][0]
            assert "standard_code" in rec
            assert "title" in rec
            assert rec["confidence"] in ["High", "Medium", "Low"]
            assert "reason" in rec


@pytest.mark.asyncio
async def test_recommend_standards_invalid_payload():
    """
    Integration test: POST /api/recommend with missing required product_name field.
    Verifies HTTP 422 validation error response.
    """
    payload = {
        "industry": "Lighting"
    }

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.post("/api/recommend", json=payload)
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

        data = response.json()
        assert "error" in data
        assert data["error"]["code"] == "validation_error"
