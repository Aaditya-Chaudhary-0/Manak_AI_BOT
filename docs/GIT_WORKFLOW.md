# GIT_WORKFLOW.md — ManakAI

## Branch Structure
- `main` — always demo-ready. Never commit directly.
- `develop` — integration branch. Feature branches merge here first.
- `feature/<short-name>` — one branch per task, e.g. `feature/hybrid-retrieval`, `feature/standards-search-ui`.

## Workflow
1. Branch off `develop`: `git checkout -b feature/hybrid-retrieval develop`
2. Commit small, focused changes with clear messages (see convention below).
3. Push and open a PR into `develop`, not `main`.
4. At least one teammate reviews before merge (2-person team: the other backend dev; for frontend PRs, either backend dev sanity-checks the API usage).
5. Merge `develop` → `main` only at stable checkpoints (end of each roadmap phase, before demo rehearsals).

## Commit Message Convention
```
<type>(<scope>): <short description>

feat(retrieval): add hybrid rerank scoring
fix(api): correct confidence bucket thresholds
docs(schema): add chunks table indexes
chore(env): update .env.example
```
Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`.

## Ownership Boundaries (avoid merge conflicts)
- Dev 1: `backend/app/ingestion/`, `backend/app/retrieval/`, `backend/scripts/`
- Dev 2: `backend/app/api/`, `backend/app/auth/`, `backend/app/agentverse/`, `backend/app/models/` (schema changes coordinated via PR)
- Frontend dev: `frontend/` entirely

Anyone touching `docs/DATABASE_SCHEMA.md` or `docs/API_CONTRACT.md` should flag it in the team chat before merging — these are the shared contracts both other roles depend on.

## Before Every Merge to `main`
- [ ] `pytest` passes on backend
- [ ] Benchmark script (`BENCHMARK_QUESTIONS.md`) still passes at current threshold
- [ ] `.env.example` updated if new env vars were added
- [ ] No secrets committed (check `git diff` before push)
