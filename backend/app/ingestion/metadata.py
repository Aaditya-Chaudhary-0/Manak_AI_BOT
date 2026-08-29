import hashlib
import logging
import os
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Any, Optional, Union
import pdfplumber

logger = logging.getLogger(__name__)

IS_CODE_INFER_REGEX = re.compile(
    r"IS[\s-]?(\d{3,6})(?:\s*[-:_]?\s*Part\s*(\d+))?\b", 
    re.IGNORECASE
)


def infer_standard_code(file_name: str) -> Optional[str]:
    """
    Attempts to infer a BIS standard code from a filename.
    Examples:
    - 'IS10500.pdf' -> 'IS 10500'
    - 'IS3025-Part1.pdf' -> 'IS 3025 : Part 1'
    - 'IS-16101.pdf' -> 'IS 16101'
    - 'general_guide.pdf' -> None
    """
    match = IS_CODE_INFER_REGEX.search(file_name)
    if not match:
        return None

    code_num = match.group(1)
    part_num = match.group(2)

    if part_num:
        return f"IS {code_num} : Part {part_num}"
    return f"IS {code_num}"


def extract_pdf_metadata(file_path: Union[str, Path]) -> Dict[str, Any]:
    """
    Extracts metadata from a local PDF file.
    
    Metadata returned:
    - filename: Base name of the file
    - extension: File extension (.pdf)
    - checksum: SHA-256 hash of the file contents
    - file_size: Size in bytes
    - page_count: Number of pages in the PDF
    - last_modified: ISO 8601 string of file modification time
    - standard_code: Inferred standard code or None
    """
    path = Path(file_path).resolve()
    if not path.exists():
        raise FileNotFoundError(f"File not found: {path}")

    stat_info = path.stat()
    file_size = stat_info.st_size
    mtime = datetime.fromtimestamp(stat_info.st_mtime, tz=timezone.utc).isoformat()

    # Compute SHA-256 checksum
    hasher = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    checksum = hasher.hexdigest()

    # Extract page count using pdfplumber
    page_count = 0
    try:
        with pdfplumber.open(path) as pdf:
            page_count = len(pdf.pages)
    except Exception as e:
        logger.warning(f"Could not read page count for '{path.name}': {e}")

    # Infer standard code
    inferred_code = infer_standard_code(path.name)

    return {
        "filename": path.name,
        "extension": path.suffix.lower(),
        "checksum": checksum,
        "file_size": file_size,
        "page_count": page_count,
        "last_modified": mtime,
        "standard_code": inferred_code,
    }
