# DEMO_SCRIPT.md — ManakAI

Owner: Shared. Finalize once core flows (`/search`, `/recommend`, admin stats) are working end-to-end — this is
a rehearsal script, not a wishlist.

## 1. Timing (3-4 Minutes)

| Time | Segment | What Happens |
|---|---|---|
| 0:00-0:30 | Problem | State the problem in one breath: users don't know which standard/certification applies, and existing BIS search requires already knowing what to search for. |
| 0:30-1:15 | Wow Moment | Type a product description (not an IS code) into Search. Show ranked results with confidence badges. Open a source link live. |
| 1:15-2:00 | Evidence & Honesty | Ask a certification or hallmarking question. Point out the confidence badge and snippet — "this isn't generated, it's the actual retrieved text." Then run one of the negative benchmark queries (§N1-N4 in `BENCHMARK_QUESTIONS.md`) to show honest abstention live — this is the single strongest "hallucination-free" proof point in the whole demo. |
| 2:00-2:40 | Breadth | Quick standard-detail view + (if built) product recommendation form. |
| 2:40-3:20 | Admin/Judge View | Show admin dashboard: query volume, confidence distribution, abstained rate — real numbers from the benchmark run, not placeholders. |
| 3:20-4:00 | Architecture + Close | One architecture slide: Query → Embed → Qdrant + Postgres hybrid retrieval → Ranked evidence. Close with: "We're not generating answers — we're proving them." |

## 2. Pre-Demo Checklist

- [ ] Corpus fully ingested from `DATA_SOURCES.md`, checksum-verified fresh.
- [ ] Benchmark set (`BENCHMARK_QUESTIONS.md`) run once same-day, actual numbers noted for the admin segment.
- [ ] 10-15 known-good queries pre-selected and tested live on the demo machine/network beforehand.
- [ ] 2-3 known-abstain queries pre-selected for the honesty moment (§1:15-2:00).
- [ ] Demo machine on stable network — if live source links might be slow/unavailable, note that source cards
      link to the official page but don't depend on it loading for the demo to succeed.
- [ ] Backup: screen recording of the full flow in case of live failure.

## 3. Backup Plan

If live search fails or the network drops:
1. Fall back to the screen recording.
2. If only backend flakes: show the pre-run benchmark results table directly (`BENCHMARK_QUESTIONS.md` filled in)
   as evidence the retrieval works, walk through the architecture diagram from memory.
3. Never improvise a "let me just check if it's working" moment on stage — switch to backup immediately if the
   first query doesn't return within ~5 seconds.

## 4. Anticipated Judge Questions (Cross-Reference PRD.md §15)

Keep these two answers memorized cold, since they'll almost certainly come up:
- **"Why no LLM?"** → hallucination risk in a compliance domain; retrieval-only guarantees traceability;
  architecture is generation-ready if added later.
- **"Isn't this just search?"** → hybrid semantic + exact retrieval with confidence scoring and abstention,
  which is the retrieval half of the RAG architecture the problem statement describes, minus the risk of the
  generation half.

## 5. Closing Line

"We are not replacing BIS. We are making BIS knowledge easier to discover, understand, and verify — and every
answer we show you traces back to an official source, because nothing here is generated."
