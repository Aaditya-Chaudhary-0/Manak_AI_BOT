# System Architecture

```
                User
                  │
                  ▼
          React Frontend
                  │
                  ▼
           FastAPI Backend
                  │
                  ▼
        Fetch.ai Agentverse
                  │
                  ▼
          Search Service
            │         │
            ▼         ▼
        Qdrant    PostgreSQL
      (Vectors)   (Metadata)
            │
            ▼
      Evidence & References
```

## Components

### React

Provides the user interface.

### FastAPI

Handles API requests.

### Fetch.ai Agentverse

Coordinates search requests.

### Search Service

Performs semantic search.

### Qdrant

Stores embeddings.

### PostgreSQL

Stores metadata and references.