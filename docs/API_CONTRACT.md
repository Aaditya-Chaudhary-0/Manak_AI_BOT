# API_CONTRACT.md — ManakAI

Base URL (local dev): `http://localhost:8000/api`

All authenticated endpoints require header: `Authorization: Bearer <jwt>`

---

## Auth

### POST /auth/signup
**Request**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "user"
}
```
**Response 201**
```json
{ "id": "uuid", "name": "string", "email": "string", "role": "user" }
```
**Errors**: 409 email already exists, 422 validation.

### POST /auth/login
**Request**
```json
{ "email": "string", "password": "string" }
```
**Response 200**
```json
{ "access_token": "jwt", "token_type": "bearer", "user": { "id": "uuid", "name": "string", "role": "user" } }
```
**Errors**: 401 invalid credentials.

---

## Search / Retrieval

### POST /search
**Request**
```json
{
  "query": "which standard applies to LED bulbs",
  "language": "en",
  "top_k": 5
}
```
**Response 200**
```json
{
  "query": "which standard applies to LED bulbs",
  "abstained": false,
  "results": [
    {
      "result_id": "uuid",
      "standard_code": "IS 16101",
      "title": "LED Luminaires - General Requirements",
      "snippet": "verbatim retrieved text ...",
      "source_url": "https://bis.gov.in/...",
      "score": 0.87,
      "confidence": "High",
      "last_indexed": "2026-08-01T00:00:00Z"
    }
  ]
}
```
**Abstention case (response 200, `abstained: true`)**
```json
{
  "query": "...",
  "abstained": true,
  "message": "No sufficiently relevant evidence found in the indexed BIS corpus.",
  "results": []
}
```

### POST /recommend
**Request**
```json
{
  "product_name": "LED bulb",
  "material": "plastic/metal housing",
  "use_case": "general indoor lighting",
  "spec_text": "optional free text or uploaded spec excerpt"
}
```
**Response 200**
```json
{
  "strong_matches": [ /* same shape as /search results */ ],
  "possible_matches": [ /* ... */ ],
  "needs_verification": [ /* ... */ ]
}
```

---

## Standards

### GET /standards/search?q=&status=&page=
**Response 200**
```json
{
  "total": 42,
  "page": 1,
  "results": [
    { "id": "uuid", "code": "IS 16101", "title": "...", "status": "Active", "version": "2023" }
  ]
}
```

### GET /standards/{id}
**Response 200**
```json
{
  "id": "uuid",
  "code": "IS 16101",
  "title": "...",
  "scope": "...",
  "status": "Active",
  "version": "2023",
  "last_updated": "2026-01-10",
  "related_standards": ["IS 16102"],
  "sources": [ { "source_id": "uuid", "title": "...", "url": "..." } ]
}
```

---

## History & Feedback

### GET /history
**Response 200**
```json
{
  "queries": [
    { "id": "uuid", "text": "...", "created_at": "...", "result_count": 3 }
  ]
}
```

### POST /feedback
**Request**
```json
{ "result_id": "uuid", "rating": "helpful", "reason": "optional string" }
```
**Response 204**

---

## Admin (role=admin only)

### GET /admin/stats
**Response 200**
```json
{
  "total_queries": 1200,
  "abstained_rate": 0.08,
  "avg_latency_ms": 340,
  "confidence_distribution": { "High": 0.62, "Medium": 0.27, "Low": 0.11 },
  "top_categories": [ { "category": "standards", "count": 480 } ]
}
```

### POST /admin/sources/reindex
**Request**
```json
{ "source_id": "uuid" }
```
**Response 202**
```json
{ "status": "queued", "source_id": "uuid" }
```

---

## Standard Error Shape (all endpoints)
```json
{ "error": { "code": "string", "message": "human-readable message" } }
```

## Status Code Conventions
- 200 success (read/query)
- 201 resource created
- 202 accepted (async job queued)
- 204 success, no body
- 401 unauthenticated
- 403 unauthorized (role mismatch)
- 404 not found
- 409 conflict
- 422 validation error
- 500 unhandled server error — never leak stack traces to the client
