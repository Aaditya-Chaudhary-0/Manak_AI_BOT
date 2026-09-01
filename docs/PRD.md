# BIS Intelligence Assistant
### Product Requirements Document — v2 (Retrieval-First Architecture)
**SIH 2026 · PS 26107 · AI-powered Intelligent Assistant for Indian Standards and BIS Services**
**Ministry:** Consumer Affairs, Food & Public Distribution — Dept. of Consumer Affairs (DoCA)

---

## 1. Executive Summary

PS 26107 asks for a conversational assistant that turns fragmented BIS knowledge (standards, certification, hallmarking, labs) into accurate, source-backed answers a non-expert can act on.

This version of the PRD reflects a **deliberate architectural decision**: the system performs **retrieval and ranking, not free-text generation**. There is no LLM writing the final answer. Instead, the backend embeds the user's query, searches an indexed corpus of official BIS content, ranks the most relevant evidence, and returns it directly — structured, scored, and cited.

This is a stricter interpretation of "hallucination-free" than a standard RAG chatbot: nothing is generated, so nothing can be invented. The tradeoff is that answers read as ranked evidence cards rather than flowing prose — addressed through frontend presentation (templated sentence structures around retrieved facts), not through a generative model.

**Core loop:** Ask → Embed → Retrieve → Rank → Return evidence with sources → User verifies.

---

## 2. Problem Statement

Users don't know which Indian Standard, certification scheme, testing requirement, or laboratory applies to their situation. BIS already publishes this information (via "Know Your Standard" and related portals), but it's scattered across PDFs, portals, and domain jargon. The user has to already know what to search for — which defeats the purpose for someone who's asking *because* they don't know.

**Representative queries:**
- MSME: "I manufacture LED bulbs. Which Indian Standard applies?"
- Procurement officer: "What testing requirements go in this tender?"
- Consumer: "What does this HUID mean?"
- Student: "Explain this standard in simple Hindi."

**Root causes:** large document volume, users start from product descriptions rather than IS numbers, related standards are easy to miss, users have wildly different domain literacy, and standards change over time so version/source context matters.

---

## 3. Users & Personas

| Persona | Main Need | Primary Interaction |
|---|---|---|
| MSME / Startup | Find applicable standard + certification path | Product description search |
| Procurement Officer | Prepare correct tender references | Standard comparison, filtered search |
| Engineer / QA | Technical standard/test detail | Standard detail view, related standards |
| Consumer | Understand BIS mark / hallmark | Simple search, plain-language snippets |
| Student | Learn about standards/services | Search + (future) simplified/Hindi output |
| BIS/Admin | Monitor quality, fill knowledge gaps | Admin analytics, review queue |

---

## 4. Product Goals

- Make BIS information searchable using natural language, not just exact IS codes.
- Recommend candidate standards from a product description.
- Return every result with a visible evidence trail: source, snippet, confidence, link.
- Explicitly abstain (say "not enough evidence") rather than guess.
- Keep the retrieval architecture swap-in-ready for a generation layer later, without needing a rebuild.
- Ship something a 2-person backend team can actually finish and demo in the hackathon window.

---

## 5. Explicit Non-Goals (What This Project Deliberately Excludes)

To keep scope realistic for a 2-person team and match the stack decisions already made:

- **No LLM-based answer generation** (no OpenAI SDK, no Gemini call in the answer path). Retrieval results are the answer.
- **No LangChain / LlamaIndex.** The pipeline (embed → search → rank → format) is simple enough to hand-write in FastAPI; a framework adds indirection without payoff at this scope.
- **No Redis** for MVP — there's no expensive generation call to cache; revisit only if query latency becomes a real bottleneck.
- **No Django** — FastAPI already covers the API surface needed; Django's batteries (admin, ORM conventions) aren't worth the switch.
- **No TensorFlow** — Sentence Transformers (PyTorch-based) covers all embedding needs.
- **No voice, no browser extension, no knowledge graph, no custom LLM** — future scope only, explicitly out of MVP.

This list matters for the pitch: judges will ask "why not use an LLM." The answer is a design decision (see §9), not a limitation.

---

## 6. Scope — MVP vs Should-Have vs Future

| Priority | Feature | Notes |
|---|---|---|
| MUST | Natural-language search over BIS knowledge | Vector + keyword hybrid retrieval |
| MUST | Standards search by IS number / product / keyword | Exact-match path via Postgres |
| MUST | Product → standard recommendation | Same retrieval pipeline, product-description query |
| MUST | Evidence/citation cards | Source, snippet, confidence, last-indexed date |
| MUST | Abstention logic | Below-threshold results → "insufficient evidence" state |
| MUST | History | Store past queries + results per user |
| SHOULD | Confidence scoring (High/Med/Low) | Derived from similarity score bands |
| SHOULD | Admin review queue | Low-confidence / zero-result queries surfaced for curation |
| SHOULD | Compare two standards | Side-by-side metadata view |
| SHOULD | Hindi query support | Depends on multilingual embedding model — flag as stretch |
| COULD | Templated natural-language answer layer | Deterministic sentence templates around top result (no generation) |
| COULD | Document upload (spec PDF) for gap analysis | Parse + chunk + match against corpus |
| FUTURE | LLM-generated prose answers | Architecture supports slotting this in later (see §9.4) |
| FUTURE | Voice input, browser extension, knowledge graph | Not in hackathon scope |

---

## 7. Functional Requirements

**FR-01 — Auth**
Signup/login/logout, JWT-based sessions, role = User or Admin, RBAC on admin routes.

**FR-02 — Query / Search**
- Accept free-text query or structured product-description fields.
- Embed query via Sentence Transformers.
- Hybrid retrieval: Qdrant vector search + Postgres keyword/full-text search (for exact IS codes).
- Merge and rank results by combined score.
- Return top-N as structured evidence objects, not prose.
- If top score < threshold → return abstention response, not a low-quality guess.

**FR-03 — Standards Search**
Search/filter by IS code, product category, status. Show title, scope summary, version, related schemes where indexed.

**FR-04 — Product-to-Standard Recommendation**
Input: product name, material, use case, optional spec text. Runs through the same retrieval pipeline as FR-02, tuned toward standard-type documents. Buckets results into Strong / Possible / Needs Verification based on score thresholds.

**FR-05 — Evidence Response**
Every result includes: source name, snippet (verbatim from indexed chunk), similarity score, confidence bucket, last-indexed date, clickable official source link.

**FR-06 — History & Feedback**
Persist queries + returned results per user. Helpful / Not Helpful feedback captured for admin review.

**FR-07 — Admin**
Query volume/category analytics, low-confidence/zero-result review queue, source ingestion status and re-index trigger.

---

## 8. System Architecture

```
User → FastAPI (Auth + API) → Retrieval Service
                                     ├─→ Sentence Transformers (query embedding)
                                     ├─→ Qdrant (vector similarity search)
                                     └─→ PostgreSQL (keyword search + metadata + relational data)
                              → Ranking/Merge → Threshold check → Response formatter → Client
```

**Offline ingestion path (admin-triggered, not user-facing):**
```
Public BIS sources (HTML/PDF) → Parse → Chunk → Embed (Sentence Transformers)
      → Store vectors + metadata in Qdrant
      → Store structured metadata (standard code, title, version, source) in PostgreSQL
```

Two data stores, two jobs: **Qdrant answers "what's semantically similar."** **PostgreSQL answers "what exactly matches, and what do we know about it."** Hybrid retrieval queries both and merges.

---

## 9. Retrieval Design (This Project's Version of RAG)

### 9.1 Why "RAG without the G"
Standard RAG retrieves context and feeds it to an LLM to generate a written answer. This project keeps retrieval and augmentation but **skips generation**, returning the retrieved evidence directly. This removes the single largest source of hallucination risk in a compliance-adjacent domain, which directly serves the PS's explicit constraint of "hallucination-free" answers and the jury metric of "hallucination rate."

### 9.2 Pipeline
1. Query normalization (lowercase, strip noise, detect if it looks like an IS code vs. free text).
2. Embed query using the same Sentence Transformers model used at ingestion time.
3. Vector search in Qdrant → top-K semantic matches.
4. Keyword/full-text search in Postgres → exact/near-exact matches (catches IS-code lookups embeddings may underweight).
5. Merge + rerank (weighted combination of vector score and keyword score; simple linear weighting is enough for MVP).
6. Threshold check — below-threshold results trigger abstention, not a forced answer.
7. Format into evidence-card response objects.

### 9.3 Confidence Scoring
Map similarity score ranges to High/Medium/Low buckets. Calibrate thresholds against the benchmark question set (§13) rather than guessing — this becomes a defendable number in front of judges.

### 9.4 Future Extension Point (Not Built Now)
The architecture is intentionally generation-ready: if a generation layer is added later, it plugs in *after* step 6, taking the ranked evidence as context for a prompt. Nothing in the retrieval layer needs to change. Worth stating explicitly in the pitch — it shows the team understood the tradeoff rather than skipping generation out of inability.

---

## 10. Technology Stack (As Decided)

| Layer | Choice | Rationale |
|---|---|---|
| Backend | FastAPI (Python) | Async-friendly, clean typed APIs, good fit for a small team |
| Relational DB | PostgreSQL | Users, queries, standards metadata, audit logs, keyword search |
| Vector DB | Qdrant | Purpose-built vector search, simpler ops than bolting pgvector on |
| Embeddings | Sentence Transformers | Local, no API cost/quota risk, swappable models |
| ORM | SQLAlchemy (+ Alembic for migrations) | Standard, async-capable |
| Auth | JWT + bcrypt/Argon2 | Simple, well-understood |
| Containerization | Docker (Postgres + Qdrant services) | Already set up |
| Dev tooling | GitHub Copilot | Autocomplete/suggestions — not agentic code generation |

**Explicitly excluded:** Django, LangChain, LlamaIndex, OpenAI SDK, Redis, TensorFlow (see §5).

---

## 11. Database Design (Core Entities)

| Entity | Key Fields |
|---|---|
| User | id, name, email, password_hash, role, created_at |
| Query | id, user_id, text, query_type, created_at |
| Result | id, query_id, chunk_id, score, confidence_bucket, created_at |
| Standard | id, code, title, scope, status, version, last_updated |
| Source | id, title, url, source_type, checksum, indexed_at |
| Chunk | id, source_id, standard_id (nullable), text, qdrant_point_id |
| Feedback | id, result_id, rating, reason, created_at |
| AuditLog | id, actor_id, action, object_type, object_id, timestamp |

Note: `Chunk.qdrant_point_id` is the join key between Postgres (metadata/facts) and Qdrant (vectors) — this is the seam of the hybrid design.

---

## 12. Core API Surface

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/auth/signup, /api/auth/login | Auth |
| POST | /api/search | Natural-language query → ranked evidence |
| POST | /api/recommend | Product description → candidate standards |
| GET | /api/standards/search?q= | Direct standards search |
| GET | /api/standards/:id | Standard detail |
| GET | /api/history | User's past queries |
| POST | /api/feedback | Helpful / not helpful on a result |
| GET | /api/admin/stats | Query volume, categories, confidence distribution |
| POST | /api/admin/sources/reindex | Trigger re-ingestion of a source |

---

## 13. Testing Strategy

- **Benchmark set:** 30–100 hand-curated questions across standards/certification/hallmarking/labs, each with a known-correct expected result. Build this before writing retrieval logic — it's what calibrates thresholds in §9.3.
- **Retrieval evaluation:** precision/recall of returned chunks against the benchmark set.
- **Abstention evaluation:** confirm the system correctly abstains on out-of-corpus questions instead of returning a weak match with false confidence.
- **Regression:** re-run the benchmark after every ingestion/index update.
- **Security:** auth, RBAC, rate limiting on search endpoints, input validation.

Do not present an invented accuracy number to judges — report what the benchmark actually measured.

---

## 14. Roadmap (2-Person Team, Backend-First)

| Phase | Focus | Output |
|---|---|---|
| 1 | Config, DB connections, Docker services | Running skeleton |
| 2 | Ingestion pipeline (parse → chunk → embed → store) | Populated corpus |
| 3 | Hybrid retrieval (Qdrant + Postgres) + ranking + thresholds | Working `/api/search` |
| 4 | Standards search, recommendation endpoint | Full core API |
| 5 | Auth, history, feedback | User-facing completeness |
| 6 | Admin analytics + review queue | Judge-facing polish |
| 7 | Benchmark evaluation, threshold tuning | Defendable numbers |
| 8 | Demo prep, seed data, backup plan | Competition-ready |

Frontend and generation-layer work are explicitly deferred/parallelized separately — this roadmap is the backend team's critical path.

---

## 15. Judge-Facing Positioning

**Anticipated question: "Why no LLM answering?"**
Direct answer: hallucination risk in a compliance domain is a real liability; retrieval-only guarantees every returned fact traces to an indexed source; the architecture is generation-ready if the team chooses to add it later (§9.4).

**Anticipated question: "Isn't this just search?"**
Direct answer: it's semantic + exact hybrid retrieval with confidence scoring and abstention — closer to evidence-ranked decision support than keyword search, and it's the retrieval half of the exact RAG architecture the PS describes, without the risk of the generation half.

**Differentiator vs. existing "Know Your Standard":** natural-language + product-description input instead of requiring the user to already know an IS code, plus confidence-scored, ranked evidence instead of a flat document list.

---

## 16. Open Decisions to Lock Before Coding

- Chunking strategy: fixed-size vs. sentence/section-aware (affects both embedding quality and Qdrant schema).
- Which multilingual/embedding model, if Hindi support is attempted in MVP vs. deferred.
- Sync vs. async DB access pattern (decide now — retrofitting async later is costly).
- Qdrant payload indexing / filters needed at query time (e.g., filter by standard status before vector search).
