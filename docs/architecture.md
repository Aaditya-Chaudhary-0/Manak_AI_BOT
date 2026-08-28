# ARCHITECTURE.md — ManakAI

## 1. High-Level System Diagram

```
                        ┌─────────────────────────┐
                        │   React + Tailwind (FE)  │
                        │   deployed on Vercel     │
                        └────────────┬─────────────┘
                                     │ REST (JSON)
                                     ▼
                        ┌─────────────────────────┐
                        │        FastAPI            │
                        │  (auth, routing, orchestration) │
                        └───┬───────────────────┬───┘
                            │                   │
                 ┌──────────▼──────┐   ┌────────▼─────────┐
                 │   PostgreSQL     │   │   Qdrant          │
                 │ (users, queries, │   │ (chunk vectors,   │
                 │ metadata, audit) │   │  BGE-M3 embeddings)│
                 └──────────────────┘   └───────────────────┘
                            ▲
                            │ orchestrates retrieval /
                            │ intent routing
                 ┌──────────┴──────────┐
                 │  Fetch.ai Agentverse │
                 │  (uAgent: query router/
                 │   retrieval coordinator)│
                 └──────────────────────┘
```

Offline / admin path (not in the request-time hot path):

```
BIS public sources → Scraper/Parser → Chunker → BGE-M3 Embedder
      → Qdrant (vectors + payload)
      → PostgreSQL (structured metadata, source registry)
```

## 2. Module Boundaries

| Module | Owns | Does NOT own |
|---|---|---|
| Ingestion (Dev 1) | Scraping, parsing, chunking, embedding, writing to Qdrant + Postgres source tables | API routes, auth, request handling |
| Backend/API (Dev 2) | FastAPI app, auth, Postgres query/write for users/queries/feedback, Agentverse integration, response formatting | Embedding logic, chunking rules |
| Agentverse layer | Routing a query to the right retrieval tool (standards vs. certification vs. hallmarking vs. labs), NOT generating prose answers | Free-text generation, vector math |
| Frontend | Rendering evidence cards, search UI, history, auth screens | Any ranking/scoring logic — that's server-side, always |

## 3. Request Flow (Search Query)

1. User submits query via frontend → `POST /api/search`.
2. FastAPI validates auth (if logged in) and request shape.
3. Agentverse agent (or, for MVP, a simple in-FastAPI router if Agentverse isn't wired yet) classifies query intent: general standard search, product recommendation, certification, hallmarking, lab lookup.
4. Based on intent, the retrieval service:
   - Embeds the query with BGE-M3.
   - Queries Qdrant for top-K semantic matches (filtered by intent-relevant collection/payload if applicable).
   - Queries Postgres for exact keyword/IS-code matches.
   - Merges + reranks.
5. Results below the confidence threshold are marked as "insufficient evidence" rather than returned as a confident answer.
6. FastAPI persists the query + result set to Postgres (for history/analytics).
7. Response returned to frontend as structured evidence objects (see `API_CONTRACT.md`).

## 4. Why This Split

- **Ingestion and retrieval are decoupled** from the request path — ingestion runs as an admin-triggered/background job, never inline with a user request. This keeps `/api/search` latency independent of how much content is indexed.
- **Postgres and Qdrant have distinct jobs**: Qdrant answers "what's semantically similar," Postgres answers "what do we know structurally, and what exactly matches." Neither replaces the other.
- **Agentverse sits at the intent-routing layer, not the answer-generation layer** — see `AGENTVERSE_INTEGRATION.md` for the precise boundary, because this is the part most likely to get misunderstood between the two backend devs.

## 5. Deployment Topology (Hackathon Scope)

- Frontend: Vercel (static/edge).
- Backend: Dockerized FastAPI service (single container is fine for MVP).
- Postgres + Qdrant: Docker Compose services (already in `docker-compose.yml`), can move to managed hosting later if needed.
- No Redis, no message queue for MVP — ingestion runs as a manual/admin-triggered script, not a queued background worker.
