import io
import logging
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


async def parse_source(url: str, source_type: str) -> Tuple[str, List[Dict[str, Any]]]:
    """
    Parses a source from the given URL.
    Returns:
        Tuple[raw_text, structure_elements]
        where structure_elements is a list of dictionaries with headings and paragraphs.
    """
    logger.info(f"Parsing source from URL: {url} (type: {source_type})")
    
    # 1. Gracefully handle mock/placeholder URLs for offline development
    if "example.com" in url or "placeholder" in url or url.startswith("mock://"):
        text = get_mock_content(url, source_type)
        return text, [{"type": "text", "content": text}]
        
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(url, follow_redirects=True)
            response.raise_for_status()
            content = response.content
    except Exception as e:
        logger.error(f"HTTP fetch failed for URL {url}: {e}")
        # TODO: Update source status to 'failed' when status column is added to the sources database schema.
        raise e

    raw_text = ""
    elements = []

    # 2. Parse PDF content
    if url.lower().endswith(".pdf") or (
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
            logger.error(f"PDF parsing failed for URL {url}: {e}")
            raise e

    # 3. Parse HTML content
    else:
        try:
            soup = BeautifulSoup(content, "html.parser")
            
            # Remove scripts, styles, navs, footers
            for trash in soup(["script", "style", "nav", "footer", "header"]):
                trash.decompose()
                
            # Attempt to find main content wrapper
            main_content = (
                soup.find("main") 
                or soup.find("article") 
                or soup.find(id="content") 
                or soup.find(class_="content") 
                or soup.body
            )
            
            if main_content is None:
                main_content = soup

            paragraphs = []
            # Extract structurally
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
                # Fallback to get_text
                raw_text = main_content.get_text(separator="\n\n", strip=True)
                elements = [{"type": "text", "content": raw_text}]
                
        except Exception as e:
            logger.error(f"HTML parsing failed for URL {url}: {e}")
            raise e

    return raw_text, elements
