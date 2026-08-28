# DATABASE_SCHEMA.md — ManakAI (PostgreSQL)

Conventions: UUID primary keys, `created_at`/`updated_at` timestamps in UTC, snake_case naming.

```sql
-- USERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user', -- 'user' | 'admin'
    preferred_language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SOURCES (registry of ingested documents/pages)
CREATE TABLE sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    source_type VARCHAR(50) NOT NULL, -- 'standard_page' | 'certification' | 'hallmarking' | 'lab' | 'faq'
    checksum VARCHAR(64), -- to detect content changes on re-index
    indexed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- STANDARDS (structured metadata, independent of chunk text)
CREATE TABLE standards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'IS 16101'
    title VARCHAR(500) NOT NULL,
    scope TEXT,
    status VARCHAR(30) DEFAULT 'Active', -- 'Active' | 'Superseded' | 'Withdrawn'
    version VARCHAR(30),
    source_id UUID REFERENCES sources(id),
    last_updated DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_standards_code ON standards(code);
CREATE INDEX idx_standards_title_trgm ON standards USING gin (title gin_trgm_ops); -- requires pg_trgm

-- CHUNKS (the join seam between Postgres and Qdrant)
CREATE TABLE chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES sources(id),
    standard_id UUID REFERENCES standards(id), -- nullable; not every chunk maps to a standard
    text TEXT NOT NULL,
    qdrant_point_id UUID NOT NULL UNIQUE, -- matches the vector's ID in Qdrant
    chunk_index INT NOT NULL, -- position within the source document
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_chunks_source ON chunks(source_id);
CREATE INDEX idx_chunks_standard ON chunks(standard_id);

-- QUERIES (user search history)
CREATE TABLE queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id), -- nullable for guest queries, if allowed
    text TEXT NOT NULL,
    query_type VARCHAR(30), -- 'search' | 'recommend' | 'standard_lookup'
    language VARCHAR(10) DEFAULT 'en',
    abstained BOOLEAN DEFAULT false,
    latency_ms INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_queries_user ON queries(user_id);

-- RESULTS (what was returned for a given query — for history + analytics)
CREATE TABLE results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_id UUID NOT NULL REFERENCES queries(id),
    chunk_id UUID NOT NULL REFERENCES chunks(id),
    score FLOAT NOT NULL,
    confidence VARCHAR(10) NOT NULL, -- 'High' | 'Medium' | 'Low'
    rank INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_results_query ON results(query_id);

-- FEEDBACK
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    result_id UUID NOT NULL REFERENCES results(id),
    user_id UUID REFERENCES users(id),
    rating VARCHAR(10) NOT NULL, -- 'helpful' | 'not_helpful'
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- AUDIT LOG
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL, -- e.g. 'source.reindex', 'user.login'
    object_type VARCHAR(50),
    object_id UUID,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## Notes for Dev 1 (ingestion) vs Dev 2 (API)

- Dev 1 writes to: `sources`, `standards`, `chunks` (and the corresponding Qdrant points). This happens in the ingestion script, not through the FastAPI request path.
- Dev 2 writes to: `users`, `queries`, `results`, `feedback`, `audit_logs` — all through FastAPI request handlers.
- `chunks.qdrant_point_id` must be generated the same way (e.g. deterministic UUID from source_id + chunk_index) so ingestion and retrieval never get out of sync.

## Migrations

Use Alembic. First migration should create all tables above plus the `pg_trgm` extension:
```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; -- if gen_random_uuid() unavailable, use uuid_generate_v4()
```
