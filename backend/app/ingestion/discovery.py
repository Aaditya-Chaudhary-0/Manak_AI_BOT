import os
import logging
from pathlib import Path
from typing import List, Union

logger = logging.getLogger(__name__)


def discover_pdf_files(folder_path: Union[str, Path]) -> List[Path]:
    """
    Recursively scans the target folder path to discover supported PDF files.
    
    Rules:
    - Recursively scans subdirectories
    - Detects every *.pdf file (case-insensitive)
    - Ignores hidden files (files starting with '.')
    - Ignores non-PDF files
    - Returns a list of Path objects sorted deterministically by filename
    """
    base_path = Path(folder_path).resolve()
    if not base_path.exists():
        logger.warning(f"Target folder path does not exist: {base_path}")
        return []

    discovered_files: List[Path] = []

    for root, dirs, files in os.walk(base_path):
        # Ignore hidden directories (e.g. .git, .venv)
        dirs[:] = [d for d in dirs if not d.startswith(".")]

        for file_name in files:
            # Ignore hidden files (e.g. .DS_Store, .gitkeep)
            if file_name.startswith("."):
                continue

            file_path = Path(root) / file_name

            # Filter for .pdf files (case-insensitive)
            if file_path.suffix.lower() == ".pdf":
                discovered_files.append(file_path)

    # Sort deterministically by filename (stem/name)
    discovered_files.sort(key=lambda p: (p.name.lower(), str(p)))
    logger.info(f"Discovered {len(discovered_files)} PDF files in '{base_path}'")

    return discovered_files
