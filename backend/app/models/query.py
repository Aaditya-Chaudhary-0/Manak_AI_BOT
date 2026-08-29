import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Text, DateTime, ForeignKey, Integer, Float, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Query(Base):
    """
    SQLAlchemy model representing a user query history record.
    """
    __tablename__ = "queries"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4
    )
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    text: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )
    query_type: Mapped[Optional[str]] = mapped_column(
        String(30),
        nullable=True
    )
    language: Mapped[str] = mapped_column(
        String(10),
        default="en",
        nullable=False
    )
    abstained: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False
    )
    latency_ms: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        nullable=False
    )

    # Relationships
    user: Mapped[Optional["User"]] = relationship("User")
    results: Mapped[List["Result"]] = relationship(
        "Result",
        back_populates="query",
        cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Query id={self.id} type={self.query_type} abstained={self.abstained}>"


class Result(Base):
    """
    SQLAlchemy model representing a retrieved search result chunk for a query.
    """
    __tablename__ = "results"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4
    )
    query_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("queries.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    chunk_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("chunks.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    score: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )
    confidence: Mapped[str] = mapped_column(
        String(10),
        nullable=False
    )
    rank: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        nullable=False
    )

    # Relationships
    query: Mapped["Query"] = relationship("Query", back_populates="results")
    chunk: Mapped["Chunk"] = relationship("Chunk", back_populates="results")
    feedbacks: Mapped[List["Feedback"]] = relationship(
        "Feedback",
        back_populates="result",
        cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Result id={self.id} query_id={self.query_id} chunk_id={self.chunk_id} score={self.score}>"


class Feedback(Base):
    """
    SQLAlchemy model representing user feedback on a search result.
    """
    __tablename__ = "feedback"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4
    )
    result_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("results.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    rating: Mapped[str] = mapped_column(
        String(10),
        nullable=False  # 'helpful' | 'not_helpful'
    )
    reason: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        nullable=False
    )

    # Relationships
    result: Mapped["Result"] = relationship("Result", back_populates="feedbacks")
    user: Mapped[Optional["User"]] = relationship("User")

    def __repr__(self) -> str:
        return f"<Feedback id={self.id} rating={self.rating}>"
