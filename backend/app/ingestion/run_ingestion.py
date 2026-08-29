import argparse
import asyncio
import hashlib
import logging
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional, List, Dict, Any

from sqlalchemy import select
from qdrant_client.models import Filter, FieldCondition, MatchValue

from app.database import AsyncSessionFactory
from app.qdrant_client import qdrant_manager
from app.ingestion.sources_seed import SEED_SOURCES
from app.ingestion.discovery import discover_pdf_files
from app.ingestion.metadata import extract_pdf_metadata
from app.ingestion.parser import parse_source
from app.ingestion.chunker import chunk_document
from app.ingestion.embedder import embed_and_store_chunks
from app.services.source_repository import SourceRepository, ChunkRepository
from app.services.standard_repository import StandardRepository
from app.models.source import Source
from app.models.standard import Standard

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("run_ingestion")


async def process_single_pdf(
    file_path: Path,
    session,
    source_repo: SourceRepository,
    chunk_repo: ChunkRepository,
    standard_repo: StandardRepository,
    force: bool = False
) -> Dict[str, Any]:
    """
    Processes a single local PDF file through the metadata extraction, parsing, chunking, and embedding stages.
    """
    abs_path_str = str(file_path.resolve())
    
    # 1. Extract PDF metadata
    metadata = extract_pdf_metadata(file_path)
    filename = metadata["filename"]
    checksum = metadata["checksum"]
    page_count = metadata["page_count"]
    standard_code = metadata["standard_code"]
    
    logger.info(f"Processing local PDF: '{filename}' (Pages: {page_count}, Size: {metadata['file_size']} bytes)")

    # 2. Check if Source already exists in database
    res = await session.execute(select(Source).filter_by(url=abs_path_str))
    db_source = res.scalars().first()

    if not db_source:
        db_source = Source(
            title=filename,
            url=abs_path_str,
            source_type="standard_pdf",
            checksum=None
        )
        db_source = await source_repo.create(db_source)
        logger.info(f"Created Source record for '{filename}': {db_source.id}")

    # 3. Check for standard association
    standard_id = None
    if standard_code:
        std = await standard_repo.get_by_code(standard_code)
        if not std:
            std = Standard(
                code=standard_code,
                title=filename.replace(".pdf", "").replace(".PDF", ""),
                source_id=db_source.id,
                status="Active"
            )
            std = await standard_repo.create(std)
            logger.info(f"Created Standard record for inferred code '{standard_code}': {std.id}")
        standard_id = std.id

    # 4. Incremental Indexing Check
    if not force and db_source.checksum == checksum:
        logger.info(f"Skipped (unchanged): '{filename}'")
        return {"status": "skipped", "chunks": 0}

    logger.info(f"Indexing '{filename}' (Checksum changed or forced re-index)...")

    # 5. Clean up old Qdrant points and Postgres chunks (Safe Re-index)
    try:
        await qdrant_manager.async_client.delete(
            collection_name=qdrant_manager.collection_name,
            points_selector=Filter(
                must=[
                    FieldCondition(
                        key="source_id",
                        match=MatchValue(value=str(db_source.id))
                    )
                ]
            )
        )
        await chunk_repo.delete_by_source_id(db_source.id)
    except Exception as e:
        logger.warning(f"Error clearing previous index for source {db_source.id}: {e}")

    # 6. Parse PDF text
    raw_text, elements = await parse_source(abs_path_str, source_type="standard_pdf")

    # 7. Chunk Document
    chunks_data = chunk_document(raw_text, elements, source_type="standard_pdf")

    # 8. Embed & Store
    num_chunks = await embed_and_store_chunks(
        source_id=db_source.id,
        source_type="standard_pdf",
        chunks_data=chunks_data,
        standard_id=standard_id,
        chunk_repo=chunk_repo
    )

    # 9. Update Source metadata
    await source_repo.update(db_source, {
        "checksum": checksum,
        "indexed_at": datetime.now(timezone.utc)
    })

    logger.info(f"Completed: '{filename}' (Chunks: {num_chunks})")
    await source_repo.update(
    db_source,
    {
        "checksum": checksum,
        "indexed_at": datetime.now(timezone.utc),
    },
)

    return {"status": "processed", "chunks": num_chunks}


async def process_seed_source(
    seed_source: dict,
    session,
    source_repo: SourceRepository,
    chunk_repo: ChunkRepository,
    force: bool = False
) -> Dict[str, Any]:
    """
    Processes a seed URL source.
    """
    url = seed_source["url"]
    source_type = seed_source["source_type"]
    title = seed_source.get("title", url)

    # Check if source already exists
    res = await session.execute(
        select(Source).filter_by(url=url)
    )
    db_source = res.scalars().first()

    # Create source if it doesn't exist
    if not db_source:
        db_source = Source(
            title=title,
            url=url,
            source_type=source_type
        )
        db_source = await source_repo.create(db_source)

    # Parse source
    raw_text, elements = await parse_source(url, source_type)

    # Compute checksum
    content_hash = hashlib.sha256(
        raw_text.encode("utf-8")
    ).hexdigest()

    # Skip if unchanged
    if not force and db_source.checksum == content_hash:
        logger.info(f"Skipped (unchanged seed source): '{url}'")
        return {
            "status": "skipped",
            "chunks": 0
        }

    # Delete previous vectors from Qdrant
    await qdrant_manager.async_client.delete(
        collection_name=qdrant_manager.collection_name,
        points_selector=Filter(
            must=[
                FieldCondition(
                    key="source_id",
                    match=MatchValue(value=str(db_source.id))
                )
            ]
        )
    )

    # Delete previous chunks from PostgreSQL
    await chunk_repo.delete_by_source_id(db_source.id)

    # Chunk document
    chunks_data = chunk_document(
        raw_text,
        elements,
        source_type
    )

    # Embed & store
    num_chunks = await embed_and_store_chunks(
        source_id=db_source.id,
        source_type=source_type,
        chunks_data=chunks_data,
        standard_id=None,
        chunk_repo=chunk_repo,
    )

    # Update checksum + indexed timestamp
    await source_repo.update(
        db_source,
        {
            "checksum": content_hash,
            "indexed_at": datetime.now(timezone.utc),
        },
    )

    logger.info(
        f"Completed seed source: '{url}' (Chunks: {num_chunks})"
    )

    return {
        "status": "processed",
        "chunks": num_chunks,
    }


# Alias for backward compatibility with Milestone 3 tests
process_source = process_seed_source


async def handle_deleted_files(
    discovered_files: List[Path],
    session,
    chunk_repo: ChunkRepository
):
    """
    Handles files that exist in PostgreSQL as local PDF sources but are no longer present on disk.
    
    POLICY NOTE:
    # TODO (PRD Policy Choice): According to PRD §3 and DATA_SOURCES §5, when a local document is
    # removed from disk, its associated chunks and vector points are deleted so search results
    # do not cite missing files.
    """
    discovered_abs_set = {str(p.resolve()) for p in discovered_files}

    # Query all local PDF sources
    res = await session.execute(select(Source).filter(Source.source_type == "standard_pdf"))
    db_pdf_sources = res.scalars().all()

    for db_src in db_pdf_sources:
        if db_src.url not in discovered_abs_set and os.path.isabs(db_src.url):
            logger.warning(f"Local file deleted from disk: '{db_src.url}'. Cleaning up obsolete chunks and vectors.")
            
            # Clean vectors from Qdrant
            try:
                await qdrant_manager.async_client.delete(
                    collection_name=qdrant_manager.collection_name,
                    points_selector=Filter(
                        must=[FieldCondition(key="source_id", match=MatchValue(value=str(db_src.id)))]
                    )
                )
            except Exception as e:
                logger.error(f"Failed to delete Qdrant points for missing source {db_src.id}: {e}")

            # Clean chunks from PostgreSQL
            await chunk_repo.delete_by_source_id(db_src.id)


async def run_pipeline(
    target_folder: Optional[str] = None,
    single_pdf: Optional[str] = None,
    target_source_id: Optional[str] = None,
    force: bool = False
):
    start_time = time.perf_counter()
    logger.info("Starting ingestion pipeline...")

    # Determine default folder path
    backend_dir = Path(__file__).resolve().parent.parent.parent
    default_folder = backend_dir / "data" / "raw_bis_pdfs"

    folder_to_scan = Path(target_folder).resolve() if target_folder else default_folder
    
    summary = {
        "processed": 0,
        "skipped": 0,
        "failed": 0,
        "total_chunks": 0,
        "total_vectors": 0,
    }

    async with AsyncSessionFactory() as session:
        async with session.begin():
            source_repo = SourceRepository(session)
            chunk_repo = ChunkRepository(session)
            standard_repo = StandardRepository(session)

            # 1. Handle single PDF file CLI option
            if single_pdf:
                pdf_path = Path(single_pdf).resolve()
                if not pdf_path.exists():
                    pdf_path = folder_to_scan / single_pdf
                
                if not pdf_path.exists():
                    logger.error(f"Specified PDF file not found: {single_pdf}")
                    summary["failed"] += 1
                else:
                    try:
                        res = await process_single_pdf(pdf_path, session, source_repo, chunk_repo, standard_repo, force=force)
                        if res["status"] == "processed":
                            summary["processed"] += 1
                            summary["total_chunks"] += res["chunks"]
                            summary["total_vectors"] += res["chunks"]
                        elif res["status"] == "skipped":
                            summary["skipped"] += 1
                    except Exception as e:
                        logger.error(f"Failed processing PDF '{single_pdf}': {e}", exc_info=True)
                        summary["failed"] += 1

            # 2. Folder Discovery & Batch Ingestion
            else:
                logger.info(f"Scanning target folder: '{folder_to_scan}'")
                discovered_pdfs = discover_pdf_files(folder_to_scan)
                logger.info(f"Found {len(discovered_pdfs)} PDF files.")

                # Check for deleted files
                await handle_deleted_files(discovered_pdfs, session, chunk_repo)

                # Process discovered PDFs
                for pdf_file in discovered_pdfs:
                    try:
                        res = await process_single_pdf(pdf_file, session, source_repo, chunk_repo, standard_repo, force=force)
                        if res["status"] == "processed":
                            summary["processed"] += 1
                            summary["total_chunks"] += res["chunks"]
                            summary["total_vectors"] += res["chunks"]
                        elif res["status"] == "skipped":
                            summary["skipped"] += 1
                    except Exception as e:
                        logger.error(f"Failed processing PDF '{pdf_file.name}': {e}", exc_info=True)
                        summary["failed"] += 1

                # Also process seed sources if no custom folder/pdf was specified
                if not target_folder and not single_pdf and not target_source_id:
                    for seed in SEED_SOURCES:
                        try:
                            res = await process_seed_source(seed, session, source_repo, chunk_repo, force=force)
                            if res["status"] == "processed":
                                summary["processed"] += 1
                                summary["total_chunks"] += res["chunks"]
                                summary["total_vectors"] += res["chunks"]
                            elif res["status"] == "skipped":
                                summary["skipped"] += 1
                        except Exception as e:
                            logger.error(f"Failed processing seed source '{seed.get('url')}': {e}")
                            summary["failed"] += 1

    elapsed_sec = time.perf_counter() - start_time
    logger.info("=== Ingestion Pipeline Summary ===")
    logger.info(f"Processed: {summary['processed']}")
    logger.info(f"Skipped: {summary['skipped']}")
    logger.info(f"Failed: {summary['failed']}")
    logger.info(f"Total chunks created: {summary['total_chunks']}")
    logger.info(f"Total vectors created: {summary['total_vectors']}")
    logger.info(f"Elapsed time: {elapsed_sec:.2f}s")
    logger.info("==================================")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="ManakAI Production Ingestion Pipeline.")
    parser.add_argument("--pdf", type=str, help="Single PDF filename or path to index", default=None)
    parser.add_argument("--folder", type=str, help="Custom folder path to scan for PDFs", default=None)
    parser.add_argument("--source-id", type=str, help="Specific source UUID to ingest", default=None)
    parser.add_argument("--force", action="store_true", help="Force complete re-indexing regardless of checksum")
    
    args = parser.parse_args()
    
    asyncio.run(run_pipeline(
        target_folder=args.folder,
        single_pdf=args.pdf,
        target_source_id=args.source_id,    
        force=args.force
    ))
