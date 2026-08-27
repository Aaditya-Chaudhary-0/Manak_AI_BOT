# Development Guide

## Branch Strategy

```
main
│
└── develop
    ├── feature/backend-search
    ├── feature/backend-api
    └── feature/frontend
```

## Team Responsibilities

### Backend Developer 1

- Search
- Embeddings
- Qdrant
- Data Ingestion

### Backend Developer 2

- FastAPI
- PostgreSQL
- Agentverse
- REST APIs

### Frontend Developer

- React
- UI
- Deployment

---

## Rules

- Never push directly to main.
- Every feature should have its own branch.
- Open Pull Requests for review.