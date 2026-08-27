# Database Design

## PostgreSQL

Stores:

- Users
- Document Metadata
- Source URLs
- Page Numbers
- Search History

---

## Qdrant

Stores:

- Document Embeddings
- Chunk Embeddings
- Chunk IDs
- Document IDs

---

## Workflow

Qdrant performs semantic search.

Matching Document IDs are used to retrieve metadata from PostgreSQL.

The backend combines both results before sending the response.