# ENV_SETUP.md — ManakAI

## Prerequisites
- Python 3.11+
- Node.js 18+ (frontend)
- Docker + Docker Compose
- Git

## 1. Clone & Structure
```bash
git clone https://github.com/devarjun345/ManakAI.git
cd ManakAI
```
Expected layout:
```
ManakAI/
  backend/
  frontend/
  docs/
  docker-compose.yml
  .env.example
```

## 2. Start Infra Services
```bash
docker compose up -d postgres qdrant
```
This should bring up:
- PostgreSQL on `localhost:5432`
- Qdrant on `localhost:6333` (REST) / `6334` (gRPC)

Verify:
```bash
docker ps
curl http://localhost:6333/collections
```

## 3. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example .env    # fill in values, see below
alembic upgrade head       # apply DB migrations
uvicorn app.main:app --reload --port 8000
```

## 4. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## 5. Environment Variables (`.env`)

**Backend**
```
DATABASE_URL=postgresql+asyncpg://manakai:manakai@localhost:5432/manakai
QDRANT_URL=http://localhost:6333
QDRANT_COLLECTION=bis_chunks
JWT_SECRET=<generate a long random string>
JWT_EXPIRY_MINUTES=60
EMBEDDING_MODEL=BAAI/bge-m3
AGENTVERSE_API_KEY=<if wiring Agentverse>
ENV=development
```

**Frontend**
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

Never commit a real `.env` — only `.env.example` with placeholder values goes into git.

## 6. Seeding Test Data
```bash
cd backend
python scripts/ingest_sample_sources.py   # loads a small curated set of BIS sources for local dev
```
This keeps local dev independent of live scraping so both devs can work offline.

## 7. Running Tests
```bash
cd backend
pytest
```

## 8. Common Issues
| Symptom | Likely cause |
|---|---|
| `connection refused` on Postgres | Docker container not up, or wrong port in `DATABASE_URL` |
| Qdrant collection not found | Run `python scripts/init_qdrant_collection.py` once after first `docker compose up` |
| `bge-m3` slow to load first run | Model downloads (~2GB) on first use — expected, cached after |
| CORS errors from frontend | Confirm `NEXT_PUBLIC_API_BASE_URL` matches backend port and backend CORS middleware allows `localhost:3000` |
