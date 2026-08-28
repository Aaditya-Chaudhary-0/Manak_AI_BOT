# CHUNKING_STRATEGY.md — ManakAI

Owner: Dev 1 (Ingestion). This decision must be locked before writing ingestion code — changing it later means
re-embedding and re-indexing everything.

## 1. Chosen Approach: Section-Aware Chunking with a Size Cap

Pure fixed-size chunking (e.g. "every 500 characters") cuts mid-sentence and mid-clause, which hurts embedding
quality — the chunk stops meaning what it should mean. Pure section-based chunking (one chunk per heading) is
better semantically but produces wildly uneven chunk sizes, which hurts retrieval consistency.

**Rule:** split on natural section/paragraph boundaries first, then cap chunk size — if a section exceeds the
cap, split further at sentence boundaries.

```
1. Parse document into sections/paragraphs (use heading tags for HTML, or blank-line breaks for extracted PDF text).
2. For each section:
   a. If token count <= MAX_CHUNK_TOKENS (e.g. 350): keep as one chunk.
   b. If larger: split at sentence boundaries, greedily packing sentences until MIN_CHUNK_TOKENS (e.g. 120)
      is reached, without exceeding MAX_CHUNK_TOKENS.
3. Attach 1-2 sentences of overlap from the end of the previous chunk to the start of the next
   (helps when a fact spans a chunk boundary — but keep overlap small, it's not free).
```

## 2. Parameters (Starting Point — Tune Against Benchmark Set)

| Parameter | Value | Reason |
|---|---|---|
| MAX_CHUNK_TOKENS | 350 | Keeps chunks focused; BGE-M3 handles up to 8192 tokens but retrieval precision drops with long chunks that mix topics |
| MIN_CHUNK_TOKENS | 120 | Avoid tiny fragments that lack context |
| OVERLAP_SENTENCES | 1-2 | Reduces boundary-cut information loss without heavy duplication |

Tune these against `BENCHMARK_QUESTIONS.md` results, not by intuition — if retrieval keeps missing facts that
span two chunks, increase overlap; if results feel noisy/off-topic, shrink MAX_CHUNK_TOKENS.

## 3. Metadata Attached to Every Chunk

Every chunk stored in Qdrant carries this payload (mirrors `chunks` table in `DATABASE_SCHEMA.md`):
```json
{
  "chunk_id": "uuid",
  "source_id": "uuid",
  "standard_id": "uuid or null",
  "chunk_index": 3,
  "source_type": "standard_metadata",
  "text": "..."
}
```
`source_id` and `chunk_index` let you reconstruct the original document order if needed for display context.

## 4. Special Cases

- **Tables** (e.g. testing parameter tables in a standard): keep as a single chunk regardless of size where
  possible — splitting a table mid-row destroys its meaning. Flag table-chunks with `"is_table": true` in payload.
- **FAQ pages**: chunk per Q&A pair, not per paragraph — each pair is already a natural retrieval unit.
- **IS-code-heavy text**: never split an IS code reference (e.g. "IS 16101") across a chunk boundary; adjust
  the sentence-boundary split to avoid this.

## 5. Determinism Requirement

Given a source document, the chunking + `qdrant_point_id` generation must be **deterministic** (e.g. derive the
point ID from `sha256(source_id + chunk_index)`), so re-running ingestion on an unchanged source produces
identical chunks/IDs rather than duplicates. This is what makes re-indexing on `checksum` change safe.
