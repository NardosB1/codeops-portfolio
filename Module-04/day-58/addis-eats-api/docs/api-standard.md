# Addis Eats API Standard

## Standardized Error Envelope (5 Fields)
All HTTP errors and unhandled exceptions across the API must return a uniform JSON body containing exactly five fields:

| Field | Type | Description |
| :--- | :--- | :--- |
| `statusCode` | `number` | HTTP status code (e.g., `400`, `404`, `409`, `500`). |
| `message` | `string \| string[]` | Actionable customer-facing error message(s). |
| `path` | `string` | The request URL path that triggered the error. |
| `timestamp` | `string` | ISO-8601 UTC timestamp of when the error occurred. |
| `requestId` | `string` | Correlation ID from `x-request-id` header or generated UUIDv4. |

### Example Error Response
```json
{
  "statusCode": 400,
  "message": [
    "customerPhone must be a valid Ethiopian Telebirr number (09XXXXXXXX, 07XXXXXXXX, or +251...)"
  ],
  "path": "/api/v1/orders",
  "timestamp": "2026-11-19T01:00:00.000Z",
  "requestId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
}
```
