# ManakAI Project Audit — 2026-08-30

## Summary

The ManakAI project has a solid foundation with fully functional core services: SQLAlchemy models matching all 9 tables in `DATABASE_SCHEMA.md`, a 10-step hybrid search implementation (`BGE-M3` + Postgres full-text) adhering to `RETRIEVAL_LOGIC.md`, automated unit/integration tests, and an upgraded local PDF ingestion pipeline. The single most important item to address next is **Frontend API Integration & Endpoint Alignment**: all frontend pages currently consume mock data files (`src/data/mock*.ts`) with zero real API calls, while several documented backend endpoints (`/auth`, `/standards`, `/recommend`, `/history`, `/feedback`, `/admin`) remain unimplemented in `app/routers/`.

---

## 1. Documentation Consistency

- [MISMATCH] `docs/README.md` (line 10) references `[`docs/PRD.md`](docs/PRD.md)` using a relative prefix (`docs/docs/PRD.md`), whereas files inside `docs/` should reference `PRD.md` directly.
- [MISMATCH] `app/ingestion/run_ingestion.py` (lines 63, 109, 112, 117, 257), `tests/test_folder_ingestion.py` (line 126), and `tests/test_repositories.py` (line 76) use `source_type="standard_pdf"` and `source_type="standard_page"`, neither of which are defined in `docs/DATA_SOURCES.md` (which defines exactly five valid types: `standard_metadata`, `certification`, `hallmarking`, `lab`, `faq`).
- [MISMATCH] `app/models/audit.py` (line 14) defines `__tablename__ = "audit_logs"` (plural), whereas `docs/DATABASE_SCHEMA.md` specifies the singular table name `audit_log`.
- [OK] Every doc filename referenced across code comments (`docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/API_CONTRACT.md`, `docs/DATABASE_SCHEMA.md`, `docs/RETRIEVAL_LOGIC.md`, `docs/EMBEDDING_SPEC.md`, `docs/CHUNKING_STRATEGY.md`, `docs/AUTH_SPEC.md`, `docs/ENV_SETUP.md`, `docs/DATA_SOURCES.md`, `docs/CODING_CONVENTIONS.md`, `docs/AGENTVERSE_INTEGRATION.md`, `docs/BENCHMARK_QUESTIONS.md`, `docs/DEMO_SCRIPT.md`, `docs/DESIGN_TOKENS.md`, `docs/GIT_WORKFLOW.md`, `docs/MANUAL_SEED_DATA.md`, `docs/UI_FLOWS.md`) exists under `docs/` under that exact name.

---

## 2. Folder Structure

- [MISMATCH] `backend/app/routers/` only contains `health.py` and `search.py`. Missing thin routers defined in `docs/CODING_CONVENTIONS.md` §1: `auth.py`, `standards.py`, `recommend.py`, `history.py`, `feedback.py`, `admin.py`.
- [MISMATCH] `backend/app/schemas/` only contains `search.py`. Missing schemas defined in `docs/CODING_CONVENTIONS.md` §1: `auth.py`, `standard.py`, `admin.py`.
- [MISMATCH] `backend/app/services/` contains repository classes (`audit_repository.py`, `base_repository.py`, `query_repository.py`, `source_repository.py`, `standard_repository.py`, `user_repository.py`) placed directly inside `services/`. Missing higher-level service wrappers defined in `docs/CODING_CONVENTIONS.md` §1: `auth_service.py`, `standard_service.py`.
- [MISSING] `frontend/src/lib/api.ts` is defined in `docs/CODING_CONVENTIONS.md` §6 as the single typed fetch wrapper matching `API_CONTRACT.md`, but it does not exist in `frontend/src/`.
- [OK] `backend/app/ingestion/` contains `parser.py`, `chunker.py`, `embedder.py`, `discovery.py`, `metadata.py`, `sources_seed.py`, and `run_ingestion.py` matching the ingestion structure.
- [OK] `frontend/src/` contains `components/`, `pages/`, and `styles/` per `docs/CODING_CONVENTIONS.md` §6 (along with UI subdirectories `assets`, `context`, `data`, `layouts`, `routes`).

---

## 3. Database Layer

- [OK] All 9 tables defined in `docs/DATABASE_SCHEMA.md` are represented by SQLAlchemy ORM models (`users` in `app/models/user.py`, `sources` & `chunks` in `app/models/source.py`, `standards` & `standard_relations` in `app/models/standard.py`, `queries` & `results` & `feedback` in `app/models/query.py`, `audit_logs` in `app/models/audit.py`).
- [MISMATCH] `AuditLog` table name is `audit_logs` in `app/models/audit.py` (line 14) instead of `audit_log` specified in `docs/DATABASE_SCHEMA.md`.
- [OK] `standards.search_vector` is implemented as a generated column via `Computed("to_tsvector('english', coalesce(title,'') || ' ' || coalesce(scope,''))", persisted=True)` in `app/models/standard.py` (lines 56–63), and its GIN index `idx_standards_search_vector` is explicitly created in `__table_args__` (lines 83–87).
- [OK] `audit_log.metadata` is mapped to Python attribute `meta` in `app/models/audit.py` (lines 37–41: `meta: Mapped[Optional[Dict[str, Any]]] = mapped_column("metadata", JSONB, nullable=True)`) to avoid SQLAlchemy's reserved `metadata` property name.
- [OK] `chunks.qdrant_point_id` is generated deterministically as a valid `uuid.UUID` from SHA-256 hash bytes in `app/ingestion/embedder.py` (lines 16–25):
  ```python
  def derive_qdrant_point_id(source_id: uuid.UUID, chunk_index: int) -> uuid.UUID:
      hash_input = f"{source_id}:{chunk_index}"
      hasher = hashlib.sha256(hash_input.encode("utf-8"))
      hash_bytes = hasher.digest()
      return uuid.UUID(bytes=hash_bytes[:16])
  ```

---

## 4. Ingestion Pipeline

- [OK] Table elements are detected in `app/ingestion/parser.py` (line 178: `is_table = child.name == "table"`) and preserved as standalone chunks with `is_table=True` in `app/ingestion/chunker.py` (lines 183–188).
- [MISMATCH] For PDF documents with `"type": "page"` elements, `app/ingestion/chunker.py` (lines 118–138) iterates page by page and calls `pack_sentences()` per page, resetting chunk packing at page boundaries instead of treating the document as one continuous stream across page boundaries as specified in `docs/CHUNKING_STRATEGY.md` §2.
- [MISMATCH] `app/ingestion/run_ingestion.py` (lines 63, 109, 112, 117, 257) uses `source_type="standard_pdf"`, which is not listed in the five allowed `source_type` values in `docs/DATA_SOURCES.md`.
- [OK] Corpus state directly queried from PostgreSQL:
  - `Source` rows: **21**
  - `Standard` rows: **7**
  - `Chunk` rows: **88**

---

## 5. Retrieval / Search

- [OK] `POST /api/search` request/response schemas in `app/schemas/search.py` (`SearchRequest`, `SearchResponse`, `SearchResultItem`) match `docs/API_CONTRACT.md` §2 field names and structures (`query`, `abstained`, `message`, `results` containing `result_id`, `standard_code`, `title`, `snippet`, `source_url`, `score`, `confidence`, `last_indexed`).
- [OK] Confidence thresholds (`RETRIEVAL_ABSTAIN_THRESHOLD = 0.40`, `RETRIEVAL_HIGH_THRESHOLD = 0.75`, `RETRIEVAL_MEDIUM_THRESHOLD = 0.55`) are loaded dynamically from `app.config.settings` in `app/services/retrieval_service.py` (lines 168–175, 194).
- [OK] Hybrid score combination formula matches `docs/RETRIEVAL_LOGIC.md` §7 (0.7 vector / 0.3 keyword) in `app/services/retrieval_service.py` (line 158):
  ```python
  combined_score = (0.7 * v_score) + (0.3 * k_score)
  ```
- [OK] `Query` and `Result` ORM rows are persisted to PostgreSQL on every `/api/search` invocation in `app/services/retrieval_service.py` (lines 200–208, 240–247, 263).

---

## 6. Frontend

- [MISMATCH] Every frontend page (`AssistantPage.tsx`, `StandardsPage.tsx`, `StandardDetailPage.tsx`, `RecommendPage.tsx`, `CertificationPage.tsx`, `SavedPage.tsx`, `HistoryPage.tsx`, `ProfilePage.tsx`, and all admin pages under `src/pages/admin/`) relies exclusively on static mock data modules (`src/data/mock*.ts`). Zero pages currently invoke real backend `/api/*` HTTP endpoints.
- [MISSING] None of the frontend page components contain `TODO` comments indicating which backend endpoint they should connect to upon API integration.
- [MISSING] `frontend/src/lib/api.ts` (or equivalent API client module) is missing from `frontend/src/`.

---

## 7. Auth

- [MISSING] Authentication endpoints (`POST /api/auth/signup`, `POST /api/auth/login`), JWT validation middleware, and user context dependencies (`get_current_user`, `require_admin`) are not implemented yet in the backend.
- [OK] `queries.user_id` is explicitly passed as `user_id=None` in `app/services/retrieval_service.py` (line 206) with `# TODO: Wire to authenticated user once auth is implemented`, operating safely in guest mode without crashing.

---

## 8. Tests

- [OK] The backend test suite contains 6 test files in `backend/tests/`:
  1. `test_health.py`: Asserts `GET /health` and `GET /api/health` return HTTP 200 with DB and Qdrant health checks `ok`.
  2. `test_search.py`: Asserts IS-code regex pattern matching, linear score fusion formula/thresholds, `POST /api/search` success response with DB query/result persistence, and out-of-domain query abstention (`abstained: true`).
  3. `test_repositories.py`: Asserts CRUD operations, full-text search, CASCADE deletions, and foreign key relations for `UserRepository`, `StandardRepository`, `SourceRepository`, `ChunkRepository`, `QueryRepository`, `ResultRepository`, `FeedbackRepository`, and `AuditRepository`.
  4. `test_seed.py`: Asserts `seed_data()` execution metrics, standard/source/chunk population in DB and Qdrant, and idempotency across repeated runs.
  5. `test_folder_ingestion.py`: Asserts `discover_pdf_files()` recursive traversal and hidden file exclusion, `infer_standard_code()` regex inference, local PDF parsing, checksum skipping / `--force` re-indexing, and deleted file policy cleanup.
  6. `conftest.py`: Configures `pytest-asyncio` event loop fixtures, `AsyncClient` HTTP test client, and test DB session fixtures.
- [OK] No test asserts behavior that contradicts current documentation.

---

## 9. Open TODOs

The following five `TODO` / `FIXME` comments exist across the codebase:

1. `backend/app/ingestion/parser.py:129`:
   ```python
   # TODO: Update source status to 'failed' when status column is added to the sources database schema.
   ```
2. `backend/app/ingestion/sources_seed.py:4`:
   ```python
   # Since real BIS URLs are not provided, we include clearly marked EXAMPLE/TODO entries.
   ```
3. `backend/app/ingestion/run_ingestion.py:250`:
   ```python
   # TODO (PRD Policy Choice): According to PRD §3 and DATA_SOURCES §5, when a local document is removed from disk, its associated chunks and vector points are deleted so search results do not cite missing files.
   ```
4. `backend/app/services/retrieval_service.py:199`:
   ```python
   # Persistence: Save Query row (user_id=None for guest / # TODO: Auth wiring)
   ```
5. `backend/app/services/retrieval_service.py:206`:
   ```python
   user_id=None  # TODO: Wire to authenticated user once auth is implemented
   ```
