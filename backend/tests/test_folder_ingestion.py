import os
import shutil
import tempfile
from pathlib import Path
import pytest
from sqlalchemy import select

from app.ingestion.discovery import discover_pdf_files
from app.ingestion.metadata import infer_standard_code, extract_pdf_metadata
from app.ingestion.parser import parse_source
from app.ingestion.run_ingestion import run_pipeline, handle_deleted_files
from app.services.source_repository import SourceRepository, ChunkRepository
from app.models.source import Source, Chunk


def test_discover_pdf_files_filtering_and_sorting(tmp_path):
    """
    Unit test: Verifies that discover_pdf_files recursively finds .pdf files,
    ignores hidden files/dirs and unsupported extensions, and sorts deterministically.
    """
    # Create directory structure
    sub_dir = tmp_path / "subdir"
    sub_dir.mkdir()
    hidden_dir = tmp_path / ".hidden"
    hidden_dir.mkdir()

    # Create dummy files
    f1 = tmp_path / "IS10500.pdf"
    f2 = sub_dir / "IS3025-Part1.pdf"
    f_caps = tmp_path / "IS16101.PDF"
    f_hidden = tmp_path / ".DS_Store"
    f_hidden2 = hidden_dir / "ignored.pdf"
    f_txt = tmp_path / "readme.txt"

    for f in [f1, f2, f_caps, f_hidden, f_hidden2, f_txt]:
        f.write_text("dummy content")

    discovered = discover_pdf_files(tmp_path)

    # Should discover 3 PDF files (IS10500.pdf, IS16101.PDF, IS3025-Part1.pdf)
    assert len(discovered) == 3
    discovered_names = [p.name for p in discovered]

    assert "IS10500.pdf" in discovered_names
    assert "IS16101.PDF" in discovered_names
    assert "IS3025-Part1.pdf" in discovered_names
    assert ".DS_Store" not in discovered_names
    assert "readme.txt" not in discovered_names
    assert "ignored.pdf" not in discovered_names

    # Assert deterministic alphabetical sorting
    assert discovered_names == sorted(discovered_names, key=lambda s: (s.lower(), s))


def test_infer_standard_code():
    """
    Unit test: Verifies standard code extraction regex from filenames.
    """
    assert infer_standard_code("IS10500.pdf") == "IS 10500"
    assert infer_standard_code("IS3025-Part1.pdf") == "IS 3025 : Part 1"
    assert infer_standard_code("IS-16101.pdf") == "IS 16101"
    assert infer_standard_code("DrinWatIS10500.pdf") == "IS 10500"
    assert infer_standard_code("random_guide.pdf") is None


@pytest.mark.asyncio
async def test_parse_local_file(tmp_path):
    """
    Integration test: Verifies parsing a local file path.
    """
    sample_file = tmp_path / "sample_doc.html"
    sample_file.write_text("<html><body><h1>Test Header</h1><p>Test paragraph content.</p></body></html>")

    raw_text, elements = await parse_source(str(sample_file), "standard_pdf")

    assert "Test Header" in raw_text
    assert "Test paragraph content." in raw_text
    assert len(elements) > 0


@pytest.mark.asyncio
async def test_incremental_and_force_reindex(tmp_path, db_session):
    """
    Integration test: Verifies that running pipeline over a local PDF skips unchanged files on second run,
    and re-indexes when force=True is passed.
    """
    # Create sample local text/HTML file inside a temporary raw_bis_pdfs folder
    pdf_dir = tmp_path / "raw_bis_pdfs"
    pdf_dir.mkdir()
    sample_doc = pdf_dir / "IS10500.pdf"
    sample_doc.write_text("<html><body><h1>IS 10500</h1><p>Drinking water requirements.</p></body></html>")

    source_repo = SourceRepository(db_session)

    # First run: should process the file
    await run_pipeline(target_folder=str(pdf_dir), force=False)

    res = await db_session.execute(select(Source).filter_by(url=str(sample_doc.resolve())))
    db_src = res.scalars().first()
    assert db_src is not None
    assert db_src.checksum is not None

    # Second run without force: should skip (incremental)
    await run_pipeline(target_folder=str(pdf_dir), force=False)

    # Third run with force=True: should re-index
    await run_pipeline(target_folder=str(pdf_dir), force=True)


@pytest.mark.asyncio
async def test_deleted_files_policy(db_session):
    """
    Integration test: Verifies that handle_deleted_files cleans up Postgres chunks and Qdrant points
    for local file sources that no longer exist on disk.
    """
    from app.ingestion.embedder import derive_qdrant_point_id

    source_repo = SourceRepository(db_session)
    chunk_repo = ChunkRepository(db_session)

    # Create dummy source pointing to non-existent local file
    missing_path = "/non/existent/path/IS9999.pdf"
    deleted_source = Source(
        title="Missing PDF",
        url=missing_path,
        source_type="standard_pdf",
        checksum="dummyhash"
    )
    deleted_source = await source_repo.create(deleted_source)

    # Create dummy chunk for missing source
    dummy_chunk = Chunk(
        source_id=deleted_source.id,
        text="Obsolete chunk text",
        qdrant_point_id=derive_qdrant_point_id(deleted_source.id, 0),
        chunk_index=0
    )
    await chunk_repo.create(dummy_chunk)

    # Run handle_deleted_files with empty discovered list
    await handle_deleted_files([], db_session, chunk_repo)

    # Verify chunks for missing source are deleted
    chunks = await chunk_repo.list_by_source_id(deleted_source.id)
    assert len(chunks) == 0
