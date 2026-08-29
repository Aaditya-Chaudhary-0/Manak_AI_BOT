from fastapi import status


def test_health_check(client):
    """
    Test that the GET /health endpoint returns HTTP 200 and indicates that
    both the database and Qdrant connections are functional.
    """
    response = client.get("/health")
    assert response.status_code == status.HTTP_200_OK
    
    data = response.json()
    assert data["status"] == "ok"
    assert data["database"] == "ok"
    assert data["qdrant"] == "ok"


def test_api_health_check(client):
    """
    Test that GET /api/health also works.
    """
    response = client.get("/api/health")
    assert response.status_code == status.HTTP_200_OK
    
    data = response.json()
    assert data["status"] == "ok"
    assert data["database"] == "ok"
    assert data["qdrant"] == "ok"
