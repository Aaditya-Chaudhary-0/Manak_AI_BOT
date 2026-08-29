import logging
import re
import time
import uuid
from typing import List, Dict, Any, Tuple, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.qdrant_client import qdrant_manager
from app.services.embedding_service import embedding_service
from app.services.standard_repository import StandardRepository
from app.services.source_repository import SourceRepository, ChunkRepository
from app.services.query_repository import QueryRepository, ResultRepository
from app.models.query import Query, Result
from app.models.source import Chunk, Source
from app.models.standard import Standard
from app.schemas.search import SearchResponse, SearchResultItem

logger = logging.getLogger(__name__)

# Direct IS-code regex pattern (e.g. IS 16101, IS-10500, IS 10500)
IS_CODE_REGEX = re.compile(r"\bIS[\s-]?\d{3,6}(?:\s*:\s*Part\s*\d+)?\b", re.IGNORECASE)


class RetrievalService:
    """
    Implements the 10-step hybrid retrieval pipeline per RETRIEVAL_LOGIC.md.
    """

    @staticmethod
    def is_code_pattern_match(text: str) -> List[str]:
        """
        Extracts direct IS-code references from text.
        """
        matches = IS_CODE_REGEX.findall(text)
        cleaned = []
        for m in matches:
            # Normalize whitespace/dashes
            norm = re.sub(r"\s+", " ", m.upper().replace("-", " "))
            cleaned.append(norm)
        return cleaned

    async def search(
        self,
        db: AsyncSession,
        query: str,
        language: str = "en",
        top_k: int = 5
    ) -> SearchResponse:
        start_time = time.perf_counter()
        
        # 1. Normalize query
        query_norm = query.strip().lower()
        logger.info(f"Executing hybrid search for query: '{query_norm}' (top_k={top_k})")

        standard_repo = StandardRepository(db)
        chunk_repo = ChunkRepository(db)
        source_repo = SourceRepository(db)
        query_repo = QueryRepository(db)
        result_repo = ResultRepository(db)

        # 2. Detect direct IS-code queries
        direct_is_matches = self.is_code_pattern_match(query)
        direct_standard_chunks: List[Tuple[Chunk, Standard, Source]] = []

        if direct_is_matches:
            logger.info(f"Detected potential IS-code references in query: {direct_is_matches}")
            for code_term in direct_is_matches:
                # Try exact code match
                standard = await standard_repo.get_by_code(code_term)
                if not standard:
                    # Try text search matching term
                    stds = await standard_repo.search_by_text(code_term, limit=1)
                    if stds:
                        standard = stds[0]
                
                if standard:
                    # Fetch chunks associated with this standard
                    chunks = await chunk_repo.list_by_standard_id(standard.id, limit=5)
                    for c in chunks:
                        src = await source_repo.get_by_id(c.source_id)
                        if src:
                            direct_standard_chunks.append((c, standard, src))

        # 3. Embed the normalized query
        query_vectors = await embedding_service.embed_documents([query_norm])
        query_vector = query_vectors[0] if query_vectors else []

        # 4. Vector search in Qdrant (top 20 candidates)
        vector_candidates: Dict[str, Tuple[float, Dict[str, Any]]] = {}
        if query_vector:
            if hasattr(qdrant_manager.async_client, "query_points"):
                res = await qdrant_manager.async_client.query_points(
                    collection_name=qdrant_manager.collection_name,
                    query=query_vector,
                    limit=20
                )
                qdrant_results = res.points
            elif hasattr(qdrant_manager.async_client, "search"):
                qdrant_results = await qdrant_manager.async_client.search(
                    collection_name=qdrant_manager.collection_name,
                    query_vector=query_vector,
                    limit=20
                )
            else:
                import asyncio
                qdrant_results = await asyncio.to_thread(
                    qdrant_manager.client.search,
                    collection_name=qdrant_manager.collection_name,
                    query_vector=query_vector,
                    limit=20
                )

            for point in qdrant_results:
                v_score = max(0.0, min(1.0, float(point.score)))
                chunk_id_str = point.payload.get("chunk_id")
                if chunk_id_str:
                    vector_candidates[chunk_id_str] = (v_score, point.payload)

        # 5. Keyword search in Postgres (top 20 candidates)
        keyword_candidates: Dict[str, float] = {}
        # Search standards via full text GIN index
        matching_standards = await standard_repo.search_by_text(query_norm, limit=20)
        for rank_idx, std in enumerate(matching_standards):
            # Rank score normalized from 1.0 down to 0.1
            k_score = max(0.1, 1.0 - (rank_idx * 0.04))
            chunks = await chunk_repo.list_by_standard_id(std.id, limit=5)
            for c in chunks:
                cid_str = str(c.id)
                keyword_candidates[cid_str] = max(keyword_candidates.get(cid_str, 0.0), k_score)

        # Fallback ILIKE search on chunks if keyword_candidates are sparse
        if len(keyword_candidates) < 5:
            res_ilike = await db.execute(
                select(Chunk).filter(Chunk.text.ilike(f"%{query_norm}%")).limit(10)
            )
            ilike_chunks = res_ilike.scalars().all()
            for rank_idx, c in enumerate(ilike_chunks):
                cid_str = str(c.id)
                k_score = max(0.1, 0.8 - (rank_idx * 0.05))
                keyword_candidates[cid_str] = max(keyword_candidates.get(cid_str, 0.0), k_score)

        # 6. Merge candidate sets by chunk_id
        all_chunk_ids = set(vector_candidates.keys()) | set(keyword_candidates.keys())
        
        # Add direct IS matches chunk IDs
        direct_chunk_map = {str(c.id): (c, std, src) for c, std, src in direct_standard_chunks}
        all_chunk_ids.update(direct_chunk_map.keys())

        candidate_scores: List[Dict[str, Any]] = []

        for cid_str in all_chunk_ids:
            v_score, payload = vector_candidates.get(cid_str, (0.0, {}))
            k_score = keyword_candidates.get(cid_str, 0.0)

            # Calculate combined_score: (0.7 * vector_score) + (0.3 * keyword_score)
            combined_score = (0.7 * v_score) + (0.3 * k_score)

            # Direct IS match boost
            is_direct_match = cid_str in direct_chunk_map
            if is_direct_match:
                combined_score = max(combined_score, 0.95)
                v_score = max(v_score, 0.95)
                k_score = max(k_score, 0.95)

            # 7 & 8. Assign confidence bucket
            if combined_score >= settings.RETRIEVAL_HIGH_THRESHOLD:
                bucket = "High"
            elif combined_score >= settings.RETRIEVAL_MEDIUM_THRESHOLD:
                bucket = "Medium"
            elif combined_score >= settings.RETRIEVAL_ABSTAIN_THRESHOLD:
                bucket = "Low"
            else:
                bucket = "Abstain"

            if bucket != "Abstain" or is_direct_match:
                candidate_scores.append({
                    "chunk_id": uuid.UUID(cid_str),
                    "vector_score": v_score,
                    "keyword_score": k_score,
                    "combined_score": combined_score,
                    "confidence_bucket": "High" if is_direct_match else bucket,
                    "payload": payload,
                    "is_direct_match": is_direct_match
                })

        # 8. Sort by combined_score descending
        candidate_scores.sort(key=lambda x: x["combined_score"], reverse=True)
        top_candidates = candidate_scores[:top_k]

        # 9 & 10. Abstention check
        abstained = False
        if not top_candidates or top_candidates[0]["combined_score"] < settings.RETRIEVAL_ABSTAIN_THRESHOLD:
            abstained = True

        elapsed_ms = int((time.perf_counter() - start_time) * 1000)

        # Persistence: Save Query row (user_id=None for guest / # TODO: Auth wiring)
        query_record = Query(
            text=query,
            query_type="search",
            language=language,
            abstained=abstained,
            latency_ms=elapsed_ms,
            user_id=None  # TODO: Wire to authenticated user once auth is implemented
        )
        await query_repo.create(query_record)

        if abstained:
            logger.info(f"Query '{query}' abstained (best score below threshold {settings.RETRIEVAL_ABSTAIN_THRESHOLD})")
            await db.commit()
            return SearchResponse(
                query=query,
                abstained=True,
                message="No sufficiently relevant evidence found in the indexed BIS corpus.",
                results=[]
            )

        # Format results and persist Result rows
        results_list: List[SearchResultItem] = []

        for rank, item in enumerate(top_candidates, start=1):
            chunk_id = item["chunk_id"]
            
            # Fetch Chunk, Standard, Source models from DB for exact details
            c_obj = await chunk_repo.get_by_id(chunk_id)
            if not c_obj:
                continue

            src_obj = await source_repo.get_by_id(c_obj.source_id)
            std_obj = await standard_repo.get_by_id(c_obj.standard_id) if c_obj.standard_id else None

            title = std_obj.title if std_obj else (src_obj.title if src_obj else "BIS Specification Document")
            standard_code = std_obj.code if std_obj else None
            source_url = src_obj.url if src_obj else "https://www.bis.gov.in"
            last_indexed = src_obj.indexed_at.isoformat() if (src_obj and src_obj.indexed_at) else None

            # Persist Result row linked to Query row
            result_record = Result(
                query_id=query_record.id,
                chunk_id=chunk_id,
                rank=rank,
                score=item["combined_score"],
                confidence=item["confidence_bucket"]
            )
            await result_repo.create(result_record)

            results_list.append(
                SearchResultItem(
                    result_id=result_record.id,
                    standard_code=standard_code,
                    title=title,
                    snippet=c_obj.text,
                    source_url=source_url,
                    score=round(item["combined_score"], 4),
                    confidence=item["confidence_bucket"],
                    last_indexed=last_indexed
                )
            )

        # Commit query and result records to database
        await db.commit()

        return SearchResponse(
            query=query,
            abstained=False,
            message=None,
            results=results_list
        )


retrieval_service = RetrievalService()
