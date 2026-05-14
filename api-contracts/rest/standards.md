# AgriTrack API Standards

## Versioning
- URL-based versioning: `/api/v1/...`
- Major version bumps for breaking changes
- Minor versions for backward-compatible additions

---

## Response Envelope

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-05-14T10:30:00Z",
    "version": "1.0",
    "requestId": "req_abc123"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid mobile number format",
    "details": [
      {
        "field": "mobile",
        "message": "Must be 10 digits"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-05-14T10:30:00Z",
    "version": "1.0",
    "requestId": "req_abc123"
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    },
    "timestamp": "2026-05-14T10:30:00Z",
    "version": "1.0",
    "requestId": "req_abc123"
  }
}
```

---

## HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (resource created) |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Invalid/missing JWT |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource |
| 422 | Unprocessable | Business logic error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected error |

---

## Error Codes

| Code | Description |
|------|-------------|
| VALIDATION_ERROR | Request validation failed |
| AUTH_REQUIRED | Authentication required |
| AUTH_INVALID | Invalid JWT token |
| AUTH_EXPIRED | JWT token expired |
| PERMISSION_DENIED | User lacks required role |
| NOT_FOUND | Resource not found |
| DUPLICATE | Resource already exists |
| INVALID_STATE | Resource in invalid state for operation |
| RATE_LIMIT | Too many requests |
| SERVER_ERROR | Unexpected server error |

---

## Request Standards

### Headers
```
Content-Type: application/json
Accept: application/json
Authorization: Bearer <jwt_token>
X-Request-ID: <uuid> (optional)
X-Client-Version: 1.0.0 (optional)
```

### Query Parameters
- Filtering: `?status=active&crop_id=xxx`
- Sorting: `?sort=created_at:desc`
- Pagination: `?page=1&limit=20`
- Search: `?q=search_term`

### Timestamps
- All timestamps in ISO 8601 UTC format
- Example: `2026-05-14T10:30:00Z`

### UUIDs
- All IDs use UUID v4 format
- Example: `550e8400-e29b-41d4-a716-446655440000`

---

## Rate Limiting

| Endpoint Type | Limit |
|---------------|-------|
| Standard APIs | 1000 requests/minute per token |
| Search APIs | 100 requests/minute per token |
| Public APIs | 1000 requests/minute per IP |
| Sync APIs | 100 records/batch |

---

## Offline Sync Headers
```
X-Sync-Token: <sync_token>
X-Sync-Priority: high|normal|low
X-Offline-Queue: true
```

---

## Field Naming Convention

- snake_case for JSON keys
- Example: `first_name`, `gps_location`, `created_at`

---

## Date Formats

| Type | Format | Example |
|------|--------|---------|
| Date | YYYY-MM-DD | 2026-05-14 |
| DateTime | ISO 8601 | 2026-05-14T10:30:00Z |
| Time | HH:mm:ss | 10:30:00 |

---

## Pagination Standards

- Default page size: 20
- Max page size: 100
- Cursor-based for large datasets
- Offset-based for dashboard queries

---

## Security Requirements

1. All endpoints over HTTPS (TLS 1.3)
2. JWT tokens with expiration
3. PII fields encrypted at rest
4. API keys for service-to-service
5. CORS configured for allowed origins
6. Request size limit: 10MB

---

## Documentation

- OpenAPI 3.0 specification for all endpoints
- Postman collection available
- API changelog maintained
- Deprecation policy: 6 months notice