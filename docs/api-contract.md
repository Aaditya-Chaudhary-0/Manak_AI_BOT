# API Contract

## POST /api/search

### Request

```json
{
    "query":"LED bulb standard"
}
```

### Success Response

```json
{
    "found": true,
    "results": [
        {
            "document_id": "123",
            "standard": "IS16102",
            "title": "Self Ballasted LED Lamps",
            "evidence": "LED lamps shall comply...",
            "page": 18,
            "source": "Know Your Standards",
            "url": "https://..."
        }
    ]
}
```

### Not Found Response

```json
{
    "found": false,
    "message": "Standard not found in BIS knowledge base."
}
```