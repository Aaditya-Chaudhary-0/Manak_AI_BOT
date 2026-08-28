# ManakAI — BIS Intelligence Assistant

**SIH 2026 · Problem Statement 26107** — a natural-language search and evidence-retrieval system over Indian
Standards (BIS) knowledge: standards, certification, hallmarking, and laboratory information.

## What This Is

ManakAI lets a user ask a plain-language question or describe a product, and returns the most relevant official
BIS evidence — ranked, scored, and cited. It does **not** use an LLM to generate answers; it retrieves and ranks
real indexed content. See [`docs/PRD.md`](docs/PRD.md) §9 for why.

## Stack

- **Backend:** FastAPI (Python), PostgreSQL, Qdrant, BGE-M3 embeddings
- **Frontend:** React + Tailwind, deployed on Vercel
- **Agent layer:** Fetch.ai Agentverse (intent routing only — see [`docs/AGENTVERSE_INTEGRATION.md`](docs/AGENTVERSE_INTEGRATION.md))

## Quickstart

See [`docs/ENV_SETUP.md`](docs/ENV_SETUP.md) for full setup. Short version:

```bash
git clone https://github.com/devarjun345/ManakAI.git
cd ManakAI
docker compose up -d postgres qdrant

cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp ../.env.example .env   # fill in values
alembic upgrade head
uvicorn app.main:app --reload --port 8000

cd ../frontend
npm install
cp .env.example .env.local
npm run dev
```

## Team Roles

| Role | Owns | Key docs |
|---|---|---|
| Dev 1 — Ingestion & Retrieval | Scraping, chunking, embedding, Qdrant | `DATA_SOURCES.md`, `CHUNKING_STRATEGY.md`, `EMBEDDING_SPEC.md`, `RETRIEVAL_LOGIC.md` |
| Dev 2 — Backend API | FastAPI, Postgres, auth, Agentverse | `DATABASE_SCHEMA.md`, `API_CONTRACT.md`, `AUTH_SPEC.md`, `AGENTVERSE_INTEGRATION.md` |
| Frontend | React UI, deploy | `UI_FLOWS.md`, `DESIGN_TOKENS.md`, `API_CONTRACT.md` |

## Documentation Index (`/docs`)

| Doc | What It's For |
|---|---|
| `PRD.md` | Scope, goals, why decisions were made — read this first |
| `ARCHITECTURE.md` | System diagram, module boundaries, request flow |
| `DATABASE_SCHEMA.md` | Full Postgres schema |
| `API_CONTRACT.md` | Every endpoint's request/response shape |
| `CHUNKING_STRATEGY.md` | How source documents get split before embedding |
| `EMBEDDING_SPEC.md` | Model, vector config, Qdrant collection setup |
| `RETRIEVAL_LOGIC.md` | Ranking formula, confidence thresholds, abstention rules |
| `DATA_SOURCES.md` | Registry of what gets ingested |
| `AGENTVERSE_INTEGRATION.md` | Exact boundary of what Agentverse does (and doesn't do) |
| `AUTH_SPEC.md` | JWT flow, RBAC |
| `UI_FLOWS.md` | Screen-by-screen frontend behavior |
| `DESIGN_TOKENS.md` | Color palette, typography, Tailwind config |
| `CODING_CONVENTIONS.md` | Folder structure, naming, error handling |
| `BENCHMARK_QUESTIONS.md` | Test set used to calibrate and evaluate retrieval |
| `DEMO_SCRIPT.md` | Hackathon presentation flow and backup plan |
| `ENV_SETUP.md` | Full local dev setup |
| `GIT_WORKFLOW.md` | Branching and PR conventions |

## For AI Coding Assistants

When working on a specific piece of this codebase, load the relevant spec doc(s) above alongside this README —
not the full `PRD.md` unless scope/rationale is actually in question. `CODING_CONVENTIONS.md` should be loaded
for any backend code generation task regardless of which feature you're touching.
