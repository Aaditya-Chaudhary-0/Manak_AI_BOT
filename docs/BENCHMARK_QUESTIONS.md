# BENCHMARK_QUESTIONS.md — ManakAI

Owner: Shared (Dev 1 + Dev 2 jointly maintain this). This is what calibrates the thresholds in
`RETRIEVAL_LOGIC.md` and what backs any accuracy claim made to judges — build this early, not right before the demo.

## 1. Format

Each entry: a query, its category, and the expected correct standard/source (filled in once the corpus is
indexed and you've manually confirmed the right answer against the actual BIS source).

| # | Query | Category | Expected Result (standard code / source) | Notes |
|---|---|---|---|---|
| 1 | "Which standard applies to LED bulbs?" | standard_search | *(fill after ingestion)* | Product → standard |
| 2 | "IS 16101" | standard_search | IS 16101 (exact code lookup) | Tests direct-code path |
| 3 | "What is Scheme I certification?" | certification | *(fill in)* | |
| 4 | "How do I register as a jeweller for hallmarking?" | hallmarking | *(fill in)* | |
| 5 | "What does HUID mean?" | hallmarking | *(fill in)* | |
| 6 | "Testing requirements for pressure cookers" | standard_search | *(fill in)* | |
| 7 | "Find a lab near Delhi for textile testing" | lab_lookup | *(fill in)* | |
| 8 | "What is the process to get BIS certification for toys?" | certification | *(fill in)* | |
| 9 | "Explain IS 302 in simple terms" | standard_search | IS 302 | |
| 10 | "Is IS 10500 still active?" | standard_search | IS 10500 status field | Tests status/version display |
| ... | | | | Target 30-100 total before final tuning |

## 2. Negative / Abstention Test Cases

Equally important — confirm the system correctly says "not enough evidence" rather than forcing a weak match:

| # | Query | Expected behavior |
|---|---|---|
| N1 | "What's the weather in Delhi?" | Abstain — completely out of domain |
| N2 | "Which standard applies to interplanetary spacecraft hulls?" | Abstain — no matching BIS standard exists |
| N3 | "asdkjaslkdj random gibberish" | Abstain |
| N4 | "Tell me about ISO 9001" (a non-BIS standard) | Abstain or clearly flag as outside the BIS corpus |

## 3. How to Use This Set

1. Run every query through `/api/search` (or `/recommend` for product-style queries).
2. Record: returned top result, its combined_score, whether it matches "Expected Result."
3. Plot score distributions: known-correct matches vs. known-incorrect/abstain cases.
4. Set `RETRIEVAL_LOGIC.md` thresholds where the distributions actually separate — not by guessing round numbers.
5. Re-run this full set after any change to chunking, embedding model, or ranking weights (regression check).

## 4. Reporting to Judges

Only ever state: "on our benchmark set of N questions, we measured X% correct top-1 retrieval and Y%
correct abstention on out-of-domain queries." Do not extrapolate beyond what was actually measured, and do not
claim a number if this table hasn't been run end-to-end at least once.
