"""Integration tests for FastAPI application endpoints.

Uses TestClient to verify core routes and middleware configuration.
Requires psycopg2 to be installed (skipped otherwise).
"""

import sys
import pytest

# Skip the entire module if psycopg2 is not available
# (importing the FastAPI app triggers database.py → SQLAlchemy → psycopg2,
# and the SQLAlchemy model metaclass needs real Column types which a
# simple MagicMock cannot provide.)
try:
    import psycopg2  # noqa: F401
    HAS_PSYCOPG2 = True
except ImportError:
    HAS_PSYCOPG2 = False

pytestmark = pytest.mark.skipif(
    not HAS_PSYCOPG2,
    reason="psycopg2 not installed — router integration tests require PostgreSQL driver",
)


if HAS_PSYCOPG2:
    from fastapi.testclient import TestClient
    from app.main import app
    client = TestClient(app)
else:
    client = None  # type: ignore


class TestRootEndpoints:
    """Test the root and health endpoints."""

    def test_root_returns_service_info(self):
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["service"] == "ExitDebt API"
        assert data["version"] == "1.0.0"
        assert data["status"] == "healthy"

    def test_health_returns_ok(self):
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}


class TestCORS:
    """Test CORS middleware configuration."""

    def test_cors_headers_present(self):
        response = client.options(
            "/",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "GET",
            },
        )
        assert response.status_code == 200
        assert "access-control-allow-origin" in response.headers


class TestOpenAPISpec:
    """Test API documentation endpoints."""

    def test_openapi_json_available(self):
        response = client.get("/openapi.json")
        assert response.status_code == 200
        data = response.json()
        assert data["info"]["title"] == "ExitDebt API"

    def test_docs_page_available(self):
        response = client.get("/docs")
        assert response.status_code == 200
