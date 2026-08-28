# EMBEDDING_SPEC.md — ManakAI

Owner: Dev 1 (Ingestion), consumed by Dev 2 (query-time embedding must match exactly).

## 1. Model

**BAAI/bge-m3** via `sentence-transformers` (or the native `FlagEmbedding` library — either works, but the
team must standardize on one to avoid subtle vector-space mismatches).

Why BGE-M3 specifically:
- Multilingual — covers the English + Hindi requirement without a separate model per language.
- Supports dense retrieval, and also sparse + multi-vector modes if you want to extend hybrid search later
  (MVP only needs dense).
- Handles long input (up to 8192 tokens), so chunk-size mistakes are forgiving rather than silently truncating.

```python
from sentence_transformers import SentenceTransformer
model = SentenceTransformer("BAAI/bge-m3")
vector = model.encode(text, normalize_embeddings=True)  # always normalize — cosine search assumes unit vectors
```

**Critical rule:** the exact same model, same `normalize_embeddings` setting, and same preprocessing must be
used at ingestion time and query time. If these drift, similarity scores become meaningless.

## 2. Vector Dimensions

BGE-M3 dense output: **1024 dimensions**. Confirm this matches the Qdrant collection config before first ingest run.

## 3. Qdrant Collection Setup

```python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams

client = QdrantClient(url="http://localhost:6333")

client.create_collection(
    collection_name="bis_chunks",
    vectors_config=VectorParams(size=1024, distance=Distance.COSINE),
)
```

## 4. Point Structure

```python
from qdrant_client.models import PointStruct

point = PointStruct(
    id=chunk_uuid,              # must match chunks.qdrant_point_id in Postgres
    vector=embedding.tolist(),
    payload={
        "chunk_id": str(chunk_uuid),
        "source_id": str(source_id),
        "standard_id": str(standard_id) if standard_id else None,
        "source_type": source_type,     # 'standard_metadata' | 'certification' | 'hallmarking' | 'lab' | 'faq'
        "is_table": False,
        "text": chunk_text,             # store text in payload too — avoids a Postgres round-trip to show snippets
    },
)
client.upsert(collection_name="bis_chunks", points=[point])
```

## 5. Payload Indexing (for Filtered Search)

Create payload indexes on fields you'll filter by at query time — e.g. narrowing search to certification-related
chunks only when intent classification says "certification question":
```python
client.create_payload_index(
    collection_name="bis_chunks",
    field_name="source_type",
    field_schema="keyword",
)
```

## 6. Query-Time Embedding

```python
query_vector = model.encode(user_query, normalize_embeddings=True)
results = client.search(
    collection_name="bis_chunks",
    query_vector=query_vector.tolist(),
    limit=10,
    query_filter=None,  # or Filter(must=[FieldCondition(key="source_type", match=MatchValue(value="certification"))])
)
```

## 7. Re-Indexing

When a source's `checksum` changes (see `DATABASE_SCHEMA.md`):
1. Delete all Qdrant points where `payload.source_id == source_id`.
2. Delete corresponding rows from `chunks` table.
3. Re-run chunking + embedding for that source.
4. Insert fresh chunks + points.

Keep this as one transaction-like operation in the ingestion script — a partial re-index (old points deleted,
new ones failed to insert) leaves that source unsearchable, which is worse than stale data.
