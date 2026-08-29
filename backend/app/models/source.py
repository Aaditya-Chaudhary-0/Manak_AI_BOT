import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Text, DateTime, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Source(Base):
    """
    SQLAlchemy model representing a source document or page.
    """
    __tablename__ = "sources"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4
    )
    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )
    url: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )
    source_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )
    checksum: Mapped[Optional[str]] = mapped_column(
        String(64),
        nullable=True
    )
    indexed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        nullable=False
    )

    # Relationships
    chunks: Mapped[List["Chunk"]] = relationship(
        "Chunk",
        back_populates="source",
        cascade="all, delete-orphan"
    )
    standards: Mapped[List["Standard"]] = relationship(
        "Standard",
        back_populates="source"
    )

    def __repr__(self) -> str:
        return f"<Source id={self.id} title={self.title} type={self.source_type}>"


class Chunk(Base):
    """
    SQLAlchemy model representing a chunk of text from a source document.
    """
    __tablename__ = "chunks"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4
    )
    source_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("sources.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    standard_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        ForeignKey("standards.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    text: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )
    qdrant_point_id: Mapped[uuid.UUID] = mapped_column(
        unique=True,
        nullable=False,
        index=True
    )
    chunk_index: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        nullable=False
    )

    # Relationships
    source: Mapped["Source"] = relationship(
        "Source",
        back_populates="chunks"
    )
    standard: Mapped[Optional["Standard"]] = relationship(
        "Standard",
        back_populates="chunks"
    )
    results: Mapped[List["Result"]] = relationship(
        "Result",
        back_populates="chunk",
        cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Chunk id={self.id} source_id={self.source_id} index={self.chunk_index}>"
