import uuid
from typing import List, Optional
from pydantic import BaseModel, Field


class SearchRequest(BaseModel):
    """
    Search request payload for POST /api/search.
    """
    query: str = Field(..., min_length=1, description="Search query string")
    language: Optional[str] = Field(default="en", description="Query language code")
    top_k: Optional[int] = Field(default=5, ge=1, le=50, description="Maximum number of results to return")


class SearchResultItem(BaseModel):
    """
    Single result item in search response.
    """
    result_id: uuid.UUID = Field(..., description="Unique ID of the query result entry")
    standard_code: Optional[str] = Field(default=None, description="BIS standard code if linked")
    title: str = Field(..., description="Document or standard title")
    snippet: str = Field(..., description="Retrieved chunk text snippet")
    source_url: str = Field(..., description="URL of the original source document")
    score: float = Field(..., description="Combined retrieval score (0.0 to 1.0)")
    confidence: str = Field(..., description="Confidence bucket: 'High', 'Medium', or 'Low'")
    last_indexed: Optional[str] = Field(default=None, description="ISO 8601 timestamp of source indexing")


class SearchResponse(BaseModel):
    """
    Response model for POST /api/search matching API_CONTRACT.md.
    """
    query: str = Field(..., description="Original query string")
    abstained: bool = Field(..., description="Whether the retrieval pipeline abstained from returning results")
    message: Optional[str] = Field(default=None, description="Abstention message if abstained is True")
    results: List[SearchResultItem] = Field(default_factory=list, description="Ranked list of search results")
