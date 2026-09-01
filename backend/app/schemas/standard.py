import uuid
from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field


class StandardSummary(BaseModel):
    """
    Summary view of a standard for listing and search results.
    """
    id: uuid.UUID
    code: str
    title: str
    status: str
    version: Optional[str] = None
    scope: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class StandardSourceInfo(BaseModel):
    """
    Source document information associated with a standard.
    """
    id: uuid.UUID
    title: str
    url: str
    source_type: str

    model_config = ConfigDict(from_attributes=True)


class RelatedStandardItem(BaseModel):
    """
    Related standard reference item.
    """
    id: uuid.UUID
    code: str
    title: str
    relation_type: str

    model_config = ConfigDict(from_attributes=True)


class StandardDetail(BaseModel):
    """
    Complete detail view of a standard including source and related standards.
    """
    id: uuid.UUID
    code: str
    title: str
    status: str
    version: Optional[str] = None
    scope: Optional[str] = None
    source: Optional[StandardSourceInfo] = None
    related_standards: List[RelatedStandardItem] = Field(default_factory=list)
    last_updated: Optional[date] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class StandardsSearchResponse(BaseModel):
    """
    Paginated search/list response for standards.
    """
    total: int
    limit: int
    offset: int
    results: List[StandardSummary]


class RecommendationRequest(BaseModel):
    """
    Payload for product recommendation request.
    """
    product_name: str = Field(..., min_length=1, description="Name or type of product (e.g. LED Bulb)")
    industry: Optional[str] = Field(None, description="Industry sector (e.g. Lighting, Civil)")
    description: Optional[str] = Field(None, description="Product specifications or description")


class RecommendationItem(BaseModel):
    """
    Individual standard recommendation result.
    """
    standard_code: str
    title: str
    confidence: str
    reason: str
    score: float
    source_url: str


class RecommendationResponse(BaseModel):
    """
    Response containing top recommendations for a product.
    """
    query: str
    recommendations: List[RecommendationItem]
