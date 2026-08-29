import io
import logging
import os
from pathlib import Path
from typing import Tuple, List, Dict, Any
from bs4 import BeautifulSoup
import httpx
import pdfplumber

logger = logging.getLogger(__name__)


def get_mock_content(url: str, source_type: str) -> str:
    """
    Returns mock document content for placeholder URLs to facilitate offline testing.
    """
    if source_type == "standard_metadata":
        return """
        # IS 16101 : 2023 - LED Luminaires - General Requirements
        
        This Indian Standard (First Revision) was adopted by the Bureau of Indian Standards on recommendation of the Illumination Engineering Sectional Committee.
        
        ## Scope
        This standard specifies general and safety requirements for LED luminaires for use with supply voltages up to 1000 V. It covers LED luminaires for indoor, outdoor and industrial applications. Applies to LED light bulbs and similar solid-state lighting systems.
        
        ## Testing Requirements
        Luminaires shall pass insulation resistance test, high voltage test, and thermal endurance test. The insulation resistance shall be not less than 2 Megaohms.
        """
    elif source_type == "certification":
        return """
        # Product Certification Scheme Guidance
        
        Under Scheme-I of Schedule-II of the BIS (Conformity Assessment) Regulations, 2018, BIS grants licences to manufacturers to use the Standard Mark.
        
        ## FAQ 1: How to apply for a BIS License?
        Applicants must register online on the Manak Online portal, submit the application along with required test reports from BIS recognized labs, and pay the requisite fees.
        
        ## FAQ 2: What is the processing time?
        Typically, it takes 30 to 45 days from the date of receipt of complete application and valid test reports.
        """
    elif source_type == "hallmarking":
        return """
        # Hallmarking Overview and jeweller registration
        
        Hallmarking is the accurate determination and official recording of the proportionate content of precious metal in gold and silver articles.
        
        ## HUID Description
        HUID stands for Hallmarking Unique ID. It is a unique 6-digit alphanumeric code stamped on each gold article.
        
        ## Jeweller Registration Process
        Jewellers can register online via the BIS Portal. The registration is granted instantly upon submission of application and payment of registration fees.
        """
    return "Placeholder text for BIS source: " + url


async def parse_source(url_or_path: str, source_type: str) -> Tuple[str, List[Dict[str, Any]]]:
    """
    Parses a source from a local file path, remote HTTP/HTTPS URL, or mock URL.
    Returns:
        Tuple[raw_text, structure_elements]
        where structure_elements is a list of dictionaries with headings, paragraphs, or pages.
    """
    logger.info(f"Parsing source from target: '{url_or_path}' (type: {source_type})")
    
    # 1. Gracefully handle mock/placeholder URLs for offline development
    if "example.com" in url_or_path or "placeholder" in url_or_path or url_or_path.startswith("mock://"):
        text = get_mock_content(url_or_path, source_type)
        return text, [{"type": "text", "content": text}]

    # 2. Local File Parsing
    local_path = Path(url_or_path)
    if url_or_path.startswith("file://"):
        local_path = Path(url_or_path[7:])

    is_local = not (url_or_path.startswith("http://") or url_or_path.startswith("https://")) and (local_path.exists() or not url_or_path.startswith("http"))

    if is_local:
        if not local_path.exists():
            error_msg = f"Local file not found: {local_path}"
            logger.error(error_msg)
            raise FileNotFoundError(error_msg)

        raw_text = ""
        elements = []

        if local_path.suffix.lower() == ".pdf":
            try:
                with pdfplumber.open(local_path) as pdf:
                    pdf_texts = []
                    for idx, page in enumerate(pdf.pages):
                        page_text = page.extract_text() or ""
                        if page_text.strip():
                            pdf_texts.append(page_text)
                            elements.append({
                                "type": "page",
                                "index": idx,
                                "content": page_text
                            })
                    raw_text = "\n\n".join(pdf_texts)
            except Exception as e:
                logger.warning(f"pdfplumber failed for local file '{local_path}', falling back to text reading: {e}")
                content = local_path.read_text(encoding="utf-8", errors="ignore")
                raw_text = content
                elements = [{"type": "text", "content": raw_text}]
        else:
            try:
                content = local_path.read_text(encoding="utf-8")
                soup = BeautifulSoup(content, "html.parser")
                for trash in soup(["script", "style", "nav", "footer", "header"]):
                    trash.decompose()
                main_content = soup.find("main") or soup.find("article") or soup.body or soup
                paragraphs = [p.get_text(separator=" ", strip=True) for p in main_content.find_all(["h1", "h2", "h3", "p", "table"]) if p.get_text(strip=True)]
                raw_text = "\n\n".join(paragraphs) if paragraphs else main_content.get_text(separator="\n\n", strip=True)
                elements = [{"type": "text", "content": raw_text}]
            except Exception as e:
                logger.error(f"Local text/HTML parsing failed for '{local_path}': {e}")
                raise e

        return raw_text, elements

    # 3. Remote HTTP/HTTPS URL Parsing
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(url_or_path, follow_redirects=True)
            response.raise_for_status()
            content = response.content
    except Exception as e:
        logger.error(f"HTTP fetch failed for URL '{url_or_path}': {e}")
        # TODO: Update source status to 'failed' when status column is added to the sources database schema.
        raise e

    raw_text = ""
    elements = []

    if url_or_path.lower().endswith(".pdf") or (
        response.headers.get("content-type", "").lower() == "application/pdf"
    ):
        try:
            with pdfplumber.open(io.BytesIO(content)) as pdf:
                pdf_texts = []
                for idx, page in enumerate(pdf.pages):
                    page_text = page.extract_text() or ""
                    if page_text.strip():
                        pdf_texts.append(page_text)
                        elements.append({
                            "type": "page",
                            "index": idx,
                            "content": page_text
                        })
                raw_text = "\n\n".join(pdf_texts)
        except Exception as e:
            logger.error(f"PDF parsing failed for URL '{url_or_path}': {e}")
            raise e
    else:
        try:
            soup = BeautifulSoup(content, "html.parser")
            for trash in soup(["script", "style", "nav", "footer", "header"]):
                trash.decompose()
            main_content = (
                soup.find("main") 
                or soup.find("article") 
                or soup.find(id="content") 
                or soup.find(class_="content") 
                or soup.body
                or soup
            )
            paragraphs = []
            for child in main_content.find_all(["h1", "h2", "h3", "h4", "p", "table", "li"]):
                text_content = child.get_text(separator=" ", strip=True)
                if not text_content:
                    continue
                is_table = child.name == "table"
                elem_type = "table" if is_table else ("heading" if child.name.startswith("h") else "paragraph")
                elements.append({
                    "type": elem_type,
                    "tag": child.name,
                    "content": text_content,
                    "is_table": is_table
                })
                paragraphs.append(text_content)
                
            raw_text = "\n\n".join(paragraphs)
            if not raw_text.strip():
                raw_text = main_content.get_text(separator="\n\n", strip=True)
                elements = [{"type": "text", "content": raw_text}]
        except Exception as e:
            logger.error(f"HTML parsing failed for URL '{url_or_path}': {e}")
            raise e

    return raw_text, elements
