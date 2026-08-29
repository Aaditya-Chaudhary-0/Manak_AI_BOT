import uuid
from datetime import datetime, date
from typing import Optional, List
from sqlalchemy import String, Text, DateTime, Date, ForeignKey, Index, UniqueConstraint, Computed
from sqlalchemy.dialects.postgresql import TSVECTOR
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Standard(Base):
    """
    SQLAlchemy model representing a formal standard (e.g. IS 16101).
    """
    __tablename__ = "standards"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4
    )
    code: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
        index=True
    )
    title: Mapped[str] = mapped_column(
        String(500),
        nullable=False
    )
    scope: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    status: Mapped[str] = mapped_column(
        String(30),
        default="Active",
        nullable=False
    )
    version: Mapped[Optional[str]] = mapped_column(
        String(30),
        nullable=True
    )
    source_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        ForeignKey("sources.id", ondelete="SET NULL"),
        nullable=True
    )
    last_updated: Mapped[Optional[date]] = mapped_column(
        Date,
        nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        nullable=False
    )
    search_vector: Mapped[Optional[str]] = mapped_column(
        TSVECTOR,
        Computed(
            "to_tsvector('english', coalesce(title,'') || ' ' || coalesce(scope,''))",
            persisted=True
        ),
        nullable=True
    )

    # Relationships
    source: Mapped[Optional["Source"]] = relationship(
        "Source",
        back_populates="standards"
    )
    chunks: Mapped[List["Chunk"]] = relationship(
        "Chunk",
        back_populates="standard"
    )

    # Table arguments for the GIN trigram and search vector indices
    __table_args__ = (
        Index(
            "idx_standards_title_trgm",
            "title",
            postgresql_using="gin",
            postgresql_ops={"title": "gin_trgm_ops"}
        ),
        Index(
            "idx_standards_search_vector",
            "search_vector",
            postgresql_using="gin"
        )
    )

    def __repr__(self) -> str:
        return f"<Standard id={self.id} code={self.code} status={self.status}>"


class StandardRelation(Base):
    """
    SQLAlchemy model representing the relationship between standards (e.g., superseding).
    """
    __tablename__ = "standard_relations"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4
    )
    standard_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("standards.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    related_standard_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("standards.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    relation_type: Mapped[Optional[str]] = mapped_column(
        String(50),
        default="related",
        nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        nullable=False
    )

    # Relationships to Standard
    standard: Mapped["Standard"] = relationship(
        "Standard",
        foreign_keys=[standard_id]
    )
    related_standard: Mapped["Standard"] = relationship(
        "Standard",
        foreign_keys=[related_standard_id]
    )

    # Table arguments for uniqueness constraint
    __table_args__ = (
        UniqueConstraint(
            "standard_id",
            "related_standard_id",
            name="uq_standard_relations_pair"
        ),
    )

    def __repr__(self) -> str:
        return f"<StandardRelation standard_id={self.standard_id} related_standard_id={self.related_standard_id}>"
