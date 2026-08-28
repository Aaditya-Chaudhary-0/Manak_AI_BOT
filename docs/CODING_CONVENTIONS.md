# CODING_CONVENTIONS.md — ManakAI

Owner: Shared. Read this before generating any backend code — it's what keeps two devs' AI-assisted output
consistent enough to merge without a rewrite.

## 1. Backend Folder Structure

```
backend/
  app/
    main.py                 # FastAPI app instantiation, middleware, router registration
    config.py                # pydantic-settings based config, loads from .env
    database.py               # SQLAlchemy async engine + session dependency
    dependencies.py            # shared FastAPI Depends() functions (get_current_user, require_admin, etc.)

    models/                   # SQLAlchemy ORM models — one file per entity group
      user.py
      standard.py             # Standard, StandardRelation
      source.py                # Source, Chunk
      query.py                  # Query, Result, Feedback
      audit.py

    schemas/                  # Pydantic request/response models — mirrors API_CONTRACT.md exactly
      auth.py
      search.py
      standard.py
      admin.py

    routers/                  # One file per resource, thin — no business logic here
      auth.py
      search.py
      standards.py
      recommend.py
      history.py
      feedback.py
      admin.py

    services/                 # Business logic lives here, not in routers
      auth_service.py
      retrieval_service.py     # implements RETRIEVAL_LOGIC.md
      embedding_service.py      # wraps BGE-M3, implements EMBEDDING_SPEC.md
      standard_service.py

    ingestion/                 # Dev 1's domain — separate from the request-time app
      parser.py                 # HTML/PDF parsing per DATA_SOURCES.md
      chunker.py                 # implements CHUNKING_STRATEGY.md
      embedder.py                 # calls embedding_service, writes to Qdrant
      run_ingestion.py            # CLI entrypoint: python -m app.ingestion.run_ingestion

  scripts/
    init_qdrant_collection.py
    ingest_sample_sources.py

  alembic/                    # migrations
  tests/
    test_retrieval.py
    test_auth.py
    conftest.py

  requirements.txt
  Dockerfile
```

**Rule:** routers only parse the request, call a service function, and return the response — no direct DB or
Qdrant calls inside a router. This is what lets Dev 1 change retrieval internals without touching Dev 2's API
layer, and vice versa.

## 2. Naming Conventions

- Python: `snake_case` for functions/variables, `PascalCase` for classes (ORM models, Pydantic schemas).
- SQL tables/columns: `snake_case`, plural table names (`users`, `standards`, `chunks`).
- API routes: `kebab-case` in URLs where multi-word (`/admin/sources/reindex`), not `snake_case` in the URL itself.
- Pydantic schema files should mirror `API_CONTRACT.md` field names exactly — no silent renaming between the
  contract doc and the actual code.

## 3. Error Handling

- Never let a raw exception reach the client — every router should raise `HTTPException` with a clear `detail`,
  or let a global exception handler in `main.py` catch unhandled errors and return the standard error shape
  from `API_CONTRACT.md`:
```json
{ "error": { "code": "internal_error", "message": "Something went wrong." } }
```
- Log full exception details server-side; never leak stack traces or DB errors to the response body.
- Retrieval-specific failures (Qdrant unreachable, embedding model not loaded) should degrade to a clear 503
  with a specific `code`, not a generic 500 — this matters for debugging during the demo.

## 4. Async Conventions

- Use `async def` for all route handlers and service functions that touch the DB or Qdrant — the team already
  decided on async DB access (`asyncpg` + SQLAlchemy async engine per `ENV_SETUP.md`), so don't mix in sync
  DB calls anywhere in the request path.
- The embedding model call (`SentenceTransformer.encode`) is CPU-bound and synchronous — wrap it with
  `run_in_executor` or `asyncio.to_thread` inside `embedding_service.py` so it doesn't block the event loop.

## 5. Testing Convention

- Every service function in `services/` gets at least one test in `tests/`.
- `test_retrieval.py` should run a handful of cases from `BENCHMARK_QUESTIONS.md` directly — keep it in sync as
  that doc grows.
- Use `pytest` + `pytest-asyncio`.

## 6. Frontend Conventions (Brief — Full Detail in DESIGN_TOKENS.md / UI_FLOWS.md)

```
frontend/
  src/
    components/       # shared components — EvidenceCard, ConfidenceBadge, etc.
    pages/ (or app/)    # route-level screens per UI_FLOWS.md
    lib/
      api.ts             # typed fetch wrapper matching API_CONTRACT.md
    styles/
```
- One `EvidenceCard` component reused everywhere a result is shown (per `UI_FLOWS.md` §6) — don't fork it per screen.
- API calls go through `lib/api.ts`, not scattered `fetch()` calls in components — keeps the API contract in one place.

## 7. Git Commit Convention

Follow `GIT_WORKFLOW.md` for branch naming; commit messages should be `type: short description`
(`feat: add hybrid retrieval scoring`, `fix: qdrant point id collision`, `docs: update retrieval thresholds`).
