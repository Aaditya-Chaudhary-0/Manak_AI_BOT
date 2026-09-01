# ManakAI Backend Service

FastAPI-based backend engine for ManakAI. Responsible for indexing, storing, searching, and managing compliance standards databases.

## Tech Stack
- **FastAPI** as the API Framework
- **PostgreSQL** for relational metadata and logs
- **Qdrant** as the Vector Database (1024 dimension dense vectors, Cosine distance)
- **SQLAlchemy 2.0 (Async)** with **AsyncPG** PostgreSQL driver
- **Alembic** for relational database migrations
- **Pydantic v2** & **pydantic-settings** for configuration

---

## Getting Started

### 1. Prerequisites
- Python 3.11+
- Docker & Docker Compose

### 2. Start Infrastructures
From the workspace root directory:
```bash
docker compose up -d postgres qdrant
```

This starts:
- PostgreSQL on port `5432`
- Qdrant on port `6333` (REST API)

### 3. Backend Local Setup
From this `backend` directory:
1. Create virtual environment and activate it:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # Linux/macOS:
   source .venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Copy environment settings and configure variables (e.g. database credentials):
   ```bash
   cp env.example .env
   ```
   *Note: Ensure backend/.env contains correct DATABASE_URL credentials matching Docker Compose (e.g., `postgresql+asyncpg://postgres:postgres@localhost:5432/manakai`).*

### 4. Database Setup & Migrations
Create databases and apply migrations using Alembic:
```bash
alembic upgrade head
```

### 5. Vector Database Initialization
Initialize Qdrant collection and create payload indexes:
```bash
python scripts/init_qdrant_collection.py
```

### 6. Run the App
Launch the development server:
```bash
python -m uvicorn app.main:app --reload --port 8000
```
API Documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).
Health Check: [http://localhost:8000/health](http://localhost:8000/health).

### 7. Run Tests
Verify configuration and health endpoints:
```bash
pytest
```