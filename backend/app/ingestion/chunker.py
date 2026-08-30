import logging
import re
from typing import List, Dict, Any
from app.config import settings

logger = logging.getLogger(__name__)

# Configurable constants per CHUNKING_STRATEGY.md
MAX_CHUNK_TOKENS = 350
MIN_CHUNK_TOKENS = 120
OVERLAP_SENTENCES = 1

_tokenizer = None


def get_tokenizer():
    """
    Lazy loads the HuggingFace BGE-M3 tokenizer. Falls back to None on error.
    """
    global _tokenizer
    if _tokenizer is None:
        try:
            from transformers import AutoTokenizer
            _tokenizer = AutoTokenizer.from_pretrained(settings.EMBEDDING_MODEL)
            logger.info(f"Successfully loaded AutoTokenizer for {settings.EMBEDDING_MODEL}")
        except Exception as e:
            logger.warning(
                f"Could not load AutoTokenizer for {settings.EMBEDDING_MODEL}. "
                f"Falling back to whitespace word splitting: {e}"
            )
    return _tokenizer


def count_tokens(text: str) -> int:
    """
    Counts the number of tokens in a string using the BGE-M3 tokenizer.
    Falls back to whitespace word splitting if the tokenizer is unavailable.
    """
    tok = get_tokenizer()
    if tok is not None:
        try:
            return len(tok.encode(text, add_special_tokens=False))
        except Exception as e:
            logger.warning(f"Error encoding text with tokenizer: {e}")
            pass
    # Fallback approximation: 1 token ~ 0.75 words, so we split by whitespace
    return len(text.split())


def split_sentences(text: str) -> List[str]:
    """
    Splits text into sentences and line blocks.
    Splits on sentence terminals (. ! ?) or paragraph breaks (newlines).
    Avoids splitting after 'IS' (e.g. 'IS 16101') or abbreviations like i.e./e.g.
    """
    # Negative lookbehind for 'IS', capital letters (like standard designations), and abbreviations like i.e./e.g.
    sentence_end = re.compile(r'(?<!\bIS)(?<!\b[A-Z])(?<!\b[a-z]\.[a-z]\.)(?<=[.!?])\s+|\n\s*\n')
    raw_splits = sentence_end.split(text)
    
    sentences = []
    for s in raw_splits:
        lines = [line.strip() for line in s.split('\n') if line.strip()]
        sentences.extend(lines)
        
    return [s for s in sentences if s]


def pack_sentences(sentences: List[str], max_tokens: int, min_tokens: int, overlap_count: int) -> List[str]:
    """
    Greedily packs sentences into chunks of max_tokens size, with overlap_count sentences
    carried over as overlap.
    """
    chunks = []
    current_sentences = []
    
    for sentence in sentences:
        temp_list = current_sentences + [sentence]
        temp_text = " ".join(temp_list)
        temp_tokens = count_tokens(temp_text)
        
        if temp_tokens <= max_tokens:
            current_sentences.append(sentence)
        else:
            # Save the current chunk if it has content
            if current_sentences:
                chunks.append(" ".join(current_sentences))
                # Carry over last N sentences for overlap
                if len(current_sentences) > overlap_count:
                    current_sentences = current_sentences[-overlap_count:]
                # Try to add current sentence to the overlap
                temp_list = current_sentences + [sentence]
                temp_text = " ".join(temp_list)
                if count_tokens(temp_text) <= max_tokens:
                    current_sentences.append(sentence)
                else:
                    # If it still exceeds, start fresh with just the current sentence
                    current_sentences = [sentence]
            else:
                # Single sentence exceeds max_tokens, force save it
                chunks.append(sentence)
                current_sentences = []
                
    if current_sentences:
        chunks.append(" ".join(current_sentences))
        
    return chunks


def chunk_document(raw_text: str, elements: List[Dict[str, Any]], source_type: str) -> List[Dict[str, Any]]:
    """
    Splits the parsed document elements into chunks per CHUNKING_STRATEGY.md.
    
    Returns:
        List of dictionaries containing:
        - 'text': Chunk text.
        - 'is_table': Boolean indicating if the chunk is a table.
        - 'chunk_index': Position index starting at 0.
    """
    chunks = []

    # 1. Continuous stream PDF chunking across page boundaries
    if elements and any(e.get("type") == "page" for e in elements):
        page_elements = [e for e in elements if e.get("type") == "page"]
        
        # Build continuous text and track page character spans
        continuous_parts = []
        page_spans = []  # List of (page_number, start_offset, end_offset)
        current_offset = 0
        
        for elem in page_elements:
            page_num = elem.get("index", 0) + 1  # 1-indexed page number
            page_text = elem.get("content", "").strip()
            if not page_text:
                continue
            
            # If previous part ended mid-sentence without space/punctuation and current starts without space, join with space
            if continuous_parts and not continuous_parts[-1].endswith(("\n", " ", ".", "!", "?", ":", ";")) and not page_text.startswith(("\n", " ")):
                join_str = " "
            else:
                join_str = "\n\n" if continuous_parts else ""
                
            if join_str:
                continuous_parts.append(join_str)
                current_offset += len(join_str)
                
            start_offset = current_offset
            continuous_parts.append(page_text)
            current_offset += len(page_text)
            end_offset = current_offset
            
            page_spans.append((page_num, start_offset, end_offset))
            
        full_text = "".join(continuous_parts)
        
        if not full_text.strip():
            return []
            
        sentences = split_sentences(full_text)
        packed_chunks = pack_sentences(
            sentences,
            max_tokens=MAX_CHUNK_TOKENS,
            min_tokens=MIN_CHUNK_TOKENS,
            overlap_count=OVERLAP_SENTENCES
        )
        
        # Map each chunk back to the page numbers it overlaps with
        search_start = 0
        for chunk_idx, chunk_text in enumerate(packed_chunks):
            start_pos = full_text.find(chunk_text[:40], search_start)
            if start_pos == -1:
                start_pos = search_start
            end_pos = start_pos + len(chunk_text)
            search_start = max(search_start, start_pos + 1)
            
            pages_in_chunk = []
            for p_num, p_start, p_end in page_spans:
                if max(start_pos, p_start) < min(end_pos, p_end):
                    pages_in_chunk.append(p_num)
                    
            if not pages_in_chunk:
                pages_in_chunk = [1]
                
            chunks.append({
                "text": chunk_text,
                "is_table": False,
                "chunk_index": chunk_idx,
                "page_numbers": pages_in_chunk
            })
            
        logger.info(
            "Pages=%d Sentences=%d Chunks=%d",
            len(page_elements),
            len(sentences),
            len(chunks)
        )
        return chunks
    
    # 2. FAQ specific chunking: chunk per Q&A pair
    if source_type == "faq" or "faq" in raw_text.lower():
        qa_pairs = []
        current_qa = []
        
        for elem in elements:
            content = elem.get("content", "").strip()
            if not content:
                continue
                
            is_new_question = (
                elem.get("type") == "heading" 
                or content.lower().startswith("faq") 
                or content.lower().startswith("question") 
                or content.lower().startswith("q:") 
                or content.endswith("?")
            )
            
            if is_new_question and current_qa:
                qa_pairs.append("\n".join(current_qa))
                current_qa = [content]
            else:
                current_qa.append(content)
                
        if current_qa:
            qa_pairs.append("\n".join(current_qa))
            
        for idx, text in enumerate(qa_pairs):
            chunks.append({
                "text": text,
                "is_table": False,
                "chunk_index": idx
            })
            
        logger.info(
            "Pages=%d Sentences=%d Chunks=%d",
            1,
            len(qa_pairs),
            len(chunks)
        )
        return chunks

    # 3. Section-aware / Paragraph-aware chunking for standard HTML pages & general documents
    sections = []
    current_section = []
    
    for elem in elements:
        if elem.get("is_table"):
            if current_section:
                sections.append((False, "\n\n".join(current_section)))
                current_section = []
            sections.append((True, elem.get("content", "")))
        elif elem.get("type") == "heading":
            if current_section:
                sections.append((False, "\n\n".join(current_section)))
            current_section = [elem.get("content", "")]
        else:
            current_section.append(elem.get("content", ""))
            
    if current_section:
        sections.append((False, "\n\n".join(current_section)))

    chunk_index = 0
    all_sentences_count = 0
    for is_table, section_text in sections:
        section_text = section_text.strip()
        if not section_text:
            continue
            
        if is_table:
            chunks.append({
                "text": section_text,
                "is_table": True,
                "chunk_index": chunk_index
            })
            chunk_index += 1
            all_sentences_count += 1
            continue
            
        token_len = count_tokens(section_text)
        if token_len <= MAX_CHUNK_TOKENS:
            chunks.append({
                "text": section_text,
                "is_table": False,
                "chunk_index": chunk_index
            })
            chunk_index += 1
            all_sentences_count += len(split_sentences(section_text))
        else:
            sentences = split_sentences(section_text)
            all_sentences_count += len(sentences)
            packed = pack_sentences(
                sentences, 
                max_tokens=MAX_CHUNK_TOKENS, 
                min_tokens=MIN_CHUNK_TOKENS, 
                overlap_count=OVERLAP_SENTENCES
            )
            for text in packed:
                chunks.append({
                    "text": text,
                    "is_table": False,
                    "chunk_index": chunk_index
                })
                chunk_index += 1
                
    logger.info(
        "Pages=%d Sentences=%d Chunks=%d",
        len(elements) if elements else 1,
        all_sentences_count,
        len(chunks)
    )
    return chunks
