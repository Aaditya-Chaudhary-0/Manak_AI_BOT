# RETRIEVAL_LOGIC.md — ManakAI

Owner: Dev 2 (implements this in the API layer), tuned jointly with Dev 1 against the benchmark set.
This is the single most important doc to keep accurate — it's the piece most likely to drift from the code if
undocumented, and it's what judges will ask about directly ("how do you decide confidence?").

## 1. Pipeline (Restated From ARCHITECTURE.md, With Exact Mechanics)

```
1. Normalize query text (lowercase, strip extra whitespace)
2. Detect if query looks like a direct IS-code lookup (regex: e.g. r"IS[\s-]?\d{3,6}")
   → if yes, also run a direct exact-match lookup against standards.code
3. Embed query with BGE-M3 (same settings as EMBEDDING_SPEC.md)
4. Vector search in Qdrant → top 20 candidates with vector_score (cosine similarity, 0-1)
5. Keyword search in Postgres (tsquery against standards.search_vector, or ILIKE fallback on chunks.text)
   → top 20 candidates with keyword_score (ts_rank, normalized 0-1)
6. Merge candidate sets by chunk_id, combine scores (see §2)
7. Sort by combined_score descending, take top N (default 5)
8. Apply confidence bucketing (see §3)
9. If best combined_score < ABSTAIN_THRESHOLD → return abstained=true, empty results
```

## 2. Score Combination

Simple weighted linear combination for MVP — no need for a learned reranker at this stage:

```python
combined_score = (0.7 * vector_score) + (0.3 * keyword_score)
```

If a chunk only appeared in one search (e.g. vector search only, no keyword match), treat the missing score as 0
for that component rather than excluding the chunk — a strong semantic match with no keyword overlap is still
valid evidence.

**Weight rationale:** vector similarity is the primary signal (captures paraphrased/natural-language queries),
keyword score is a tie-breaker / boost for exact terminology matches (especially IS codes). These weights are a
starting point — log actual (query, expected_result) pairs from the benchmark set and adjust if keyword matches
are being under- or over-weighted.

## 3. Confidence Buckets

| Bucket | combined_score range | Meaning shown to user |
|---|---|---|
| High | >= 0.75 | Strong match, cite with confidence |
| Medium | 0.55 – 0.749 | Plausible match, "verify against source" framing |
| Low | 0.40 – 0.549 | Weak match, shown only if nothing better exists |
| (abstain) | < 0.40 | Not returned at all — abstention response |

**These exact numbers are placeholders — do not ship them without calibration.** Run the full benchmark set
(`BENCHMARK_QUESTIONS.md`) through the pipeline, plot the score distribution for known-correct vs known-incorrect
matches, and set thresholds where they actually separate good from bad results.

## 4. Abstention Response

When `best_combined_score < ABSTAIN_THRESHOLD`:
```json
{
  "query": "...",
  "abstained": true,
  "message": "No sufficiently relevant evidence found in the indexed BIS corpus.",
  "results": []
}
```
Never return a Low-confidence result dressed up as if it were reliable — the abstention message is the honest
answer. This is also logged (`queries.abstained = true`) so the admin review queue can surface these for
follow-up ingestion.

## 5. Direct IS-Code Path

If regex detects a direct IS-code query (e.g. "IS 16101" or "what is IS 16101"):
1. Look up `standards` table directly by `code`.
2. If found, return it as a High-confidence result even if the embedding-based path would have scored it lower
   — an exact code match is definitionally correct, no need to run it through the scoring pipeline.
3. Still also run the semantic pipeline in parallel to surface related/complementary standards below the exact match.

## 6. Product Recommendation Variant (`/api/recommend`)

Same retrieval mechanics, but:
- Query text is built by concatenating `product_name + material + use_case + spec_text`.
- Results are bucketed into **Strong / Possible / Needs Verification** instead of High/Medium/Low, using the same
  thresholds — this is a display-layer relabeling, not a different scoring method.

## 7. What NOT to Do

- Don't silently lower the abstain threshold to make the demo "always answer something" — a wrong-but-confident
  answer is worse than an honest abstention, and this undermines the entire "hallucination-free" pitch.
- Don't hardcode per-query-type thresholds without benchmark evidence — start with one global threshold, split
  only if benchmark data shows a real need.
