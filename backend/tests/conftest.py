import os
import pytest
from fastapi.testclient import TestClient

# Set ENV to testing before importing settings
os.environ["ENV"] = "testing"
# Disable verbose SQLAlchemy logging during tests
os.environ["LOG_LEVEL"] = "warning"

from app.main import app


@pytest.fixture(scope="module")
def client() -> TestClient:
    """
    Fixture providing a test client for the FastAPI application.
    """
    with TestClient(app) as test_client:
        yield test_client
