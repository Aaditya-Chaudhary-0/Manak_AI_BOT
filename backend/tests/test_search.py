import pytest
from sqlalchemy import select

from app.services.retrieval_service import RetrievalService, IS_CODE_REGEX
from app.config import settings
from app.models.query import Query, Result


def test_is_code_regex_detection():
    """
    Unit test: Verifies IS-code regex pattern matching.
    """
    retrieval = RetrievalService()

    matches1 = retrieval.is_code_pattern_match("which standard applies to IS 16101?")
    assert len(matches1) == 1
    assert "IS 16101" in matches1[0]

    matches2 = retrieval.is_code_pattern_match("Details on IS-10500 drinking water")
    assert len(matches2) == 1

    matches3 = retrieval.is_code_pattern_match("Check IS 6191 : Part 2 requirements")
    assert len(matches3) == 1

    matches4 = retrieval.is_code_pattern_match("This is a general query with no code")
    assert len(matches4) == 0


def test_score_combination_and_bucketing():
    """
    Unit test: Verifies linear score fusion formula and confidence bucketing thresholds.
    """
    # Formula: combined = (0.7 * v_score) + (0.3 * k_score)
    v_score = 0.80
    k_score = 0.90
    combined = (0.7 * v_score) + (0.3 * k_score)
    assert round(combined, 2) == 0.83

    # High threshold (>= 0.75)
    assert combined >= settings.RETRIEVAL_HIGH_THRESHOLD

    # Medium threshold (>= 0.55 and < 0.75)
    v_score_med = 0.60
    k_score_med = 0.50
    combined_med = (0.7 * v_score_med) + (0.3 * k_score_med) # 0.57
    assert settings.RETRIEVAL_MEDIUM_THRESHOLD <= combined_med < settings.RETRIEVAL_HIGH_THRESHOLD

    # Abstain threshold (< 0.40)
    v_score_low = 0.20
    k_score_low = 0.10
    combined_low = (0.7 * v_score_low) + (0.3 * k_score_low) # 0.17
    assert combined_low < settings.RETRIEVAL_ABSTAIN_THRESHOLD


@pytest.mark.asyncio
async def test_search_endpoint_success(client, db_session):
    """
    Integration test: Execute POST /api/search for a valid query against the corpus.
    Verify 200 response, schema conformity, and PostgreSQL Query + Result persistence.
    """
    payload = {
        "query": "Drinking Water Specification limits",
        "language": "en",
        "top_k": 3
    }

    response = client.post("/api/search", json=payload)
    assert response.status_code == 200

    data = response.json()
    assert data["query"] == payload["query"]
    assert data["abstained"] is False
    assert "results" in data
    assert len(data["results"]) > 0

    first_result = data["results"][0]
    assert "result_id" in first_result
    assert "title" in first_result
    assert "snippet" in first_result
    assert "score" in first_result
    assert first_result["confidence"] in ["High", "Medium", "Low"]

    # Verify persistence in Postgres
    db_session.expire_all()
    res_query = await db_session.execute(select(Query).filter_by(text=payload["query"]).order_by(Query.created_at.desc()))
    db_query = res_query.scalars().first()
    assert db_query is not None
    assert db_query.abstained is False
    assert db_query.latency_ms >= 0

    res_results = await db_session.execute(select(Result).filter_by(query_id=db_query.id))
    db_results = res_results.scalars().all()
    assert len(db_results) == len(data["results"])


@pytest.mark.asyncio
async def test_search_endpoint_abstention(client, db_session):
    """
    Integration test: Execute POST /api/search for an out-of-domain query.
    Verify abstention response (abstained: true) and PostgreSQL persistence.
    """
    payload = {
        "query": "quantum gravity black hole thermodynamics topology entropy relativity",
        "language": "en",
        "top_k": 5
    }

    response = client.post("/api/search", json=payload)
    assert response.status_code == 200

    data = response.json()
    assert data["query"] == payload["query"]
    assert data["abstained"] is True
    assert data["message"] == "No sufficiently relevant evidence found in the indexed BIS corpus."
    assert data["results"] == []

    # Verify query logged as abstained in Postgres
    res_query = await db_session.execute(select(Query).filter_by(text=payload["query"]))
    db_query = res_query.scalars().first()
    assert db_query is not None
    assert db_query.abstained is True
