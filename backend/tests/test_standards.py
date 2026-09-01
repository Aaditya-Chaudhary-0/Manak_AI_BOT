import pytest
from fastapi import status
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession

from app.main import app
from app.services.standard_repository import StandardRepository


@pytest.mark.asyncio
async def test_search_standards_without_query():
    """
    Integration test: GET /api/standards/search without a query parameter.
    Verifies 200 response, pagination fields, and standard summary list.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/standards/search?limit=5&offset=0")
        assert response.status_code == status.HTTP_200_OK

        data = response.json()
        assert "total" in data
        assert data["limit"] == 5
        assert data["offset"] == 0
        assert "results" in data
        assert isinstance(data["results"], list)


@pytest.mark.asyncio
async def test_search_standards_with_query():
    """
    Integration test: GET /api/standards/search?q=Drinking.
    Verifies full-text search filtering against PostgreSQL search_vector.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/standards/search?q=Drinking&limit=10")
        assert response.status_code == status.HTTP_200_OK

        data = response.json()
        assert data["total"] >= 1
        codes = [s["code"] for s in data["results"]]
        assert "IS 10500" in codes


@pytest.mark.asyncio
async def test_get_standard_detail_by_code():
    """
    Integration test: GET /api/standards/IS 10500.
    Verifies retrieval by standard code returning complete metadata and source details.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/standards/IS%2010500")
        assert response.status_code == status.HTTP_200_OK

        data = response.json()
        assert data["code"] == "IS 10500"
        assert "Drinking Water" in data["title"]
        assert "status" in data
        assert "related_standards" in data


@pytest.mark.asyncio
async def test_get_standard_detail_by_id(db_session: AsyncSession):
    """
    Integration test: GET /api/standards/{uuid}.
    Verifies retrieval by UUID string.
    """
    standard_repo = StandardRepository(db_session)
    is10500 = await standard_repo.get_by_code("IS 10500")
    assert is10500 is not None

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get(f"/api/standards/{is10500.id}")
        assert response.status_code == status.HTTP_200_OK

        data = response.json()
        assert data["id"] == str(is10500.id)
        assert data["code"] == "IS 10500"


@pytest.mark.asyncio
async def test_get_standard_detail_not_found():
    """
    Integration test: GET /api/standards/NONEXISTENT999.
    Verifies 404 Not Found response shape for missing standard.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/standards/NONEXISTENT999")
        assert response.status_code == status.HTTP_404_NOT_FOUND

        data = response.json()
        assert "error" in data
        assert data["error"]["code"] == "not_found"
