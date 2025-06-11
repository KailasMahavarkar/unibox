# API Reference

## Base URLs

### Production
- Backend: `https://pfm-api.setu.co`
- Frontend: `https://pfm.setu.co`

### UAT (Testing)
- Backend: `https://pfm-uat-api.setu.co`
- Frontend: `https://pfm-uat.setu.co`

## Common Headers

All API requests (except session creation) require:
```http
Cookie: token=jwt_token_here
Content-Type: application/json
```

## User Management APIs

### Get User Overview

Get comprehensive overview of user's consents and accounts.

**Endpoint:** `GET /api/user`

**Response:**
```json
{
    "user": {
        "banking_status": "SUMMARY_AVAILABLE",
        "investment_status": "SUMMARY_AVAILABLE",
        "id": "user-uuid",
        "last_refresh": "2023-12-21T10:00:00Z",
        "updated_at": "2023-12-21T10:00:00Z",
        "created_at": "2023-12-20T10:00:00Z"
    },
    "consents": [
        {
            "status": "ACTIVE",
            "handle": "consent-handle",
            "id": "consent-id",
            "updated_at": "2023-12-21T10:00:00Z",
            "expiry": "2024-12-21T10:00:00Z",
            "type": "banking",
            "accounts_linked": 2
        }
    ],
    "accounts": {
        "bank_accounts": [...],
        "investment_accounts": {
            "mutual_funds": [...],
            "brokerages": [...],
            "etfs": [...]
        }
    }
}
```

**Status Values:**
- `SUMMARY_AVAILABLE`: Data available
- `SUMMARY_NOT_AVAILABLE`: No data yet
- `SUMMARY_PENDING`: Data fetch in progress

### Get User Profile

Get detailed user profile information.

**Endpoint:** `GET /api/v1/profile`

**Response:**
```json
{
    "user": {
        "name": "John Doe",
        "pan": "ABCDE****F",
        "dob": "1990-01-01",
        "mobile": "98765****0",
        "email": "john.doe@example.com"
    },
    "accounts": {
        "bank_accounts": [...],
        "investment_accounts": {...}
    },
    "last_fetched": "2023-12-21T10:00:00Z"
}
```

## Consent Management APIs

### Create Banking Consent

Create consent for banking data access.

**Endpoint:** `POST /api/v1/banking/consent`

**Request:**
```json
{
    "redirect_url": "https://your-app.com/consent-callback"
}
```

**Response:**
```json
{
    "url": "https://aa-gateway.com/consent/approve/xxxxx",
    "status": "PENDING"
}
```

### Create Investment Consent

Create consent for investment data access (mutual funds, equities, ETFs).

**Endpoint:** `POST /api/v1/investment/consent`

**Request/Response:** Same as banking consent

### Get Consent Details

Get details of a specific consent.

**Endpoint:** `GET /api/consent/{consent_handle}`

**Response:**
```json
{
    "url": "redirect_url",
    "status": "ACTIVE"
}
```

### Revoke Consent

Revoke an active consent and delete associated data.

**Endpoint:** `POST /api/consent/{consent_handle}/revoke`

**Response:**
```json
{
    "message": "Consent revoked successfully",
    "handle": "consent-handle"
}
```

### Refresh All Data

Trigger data refresh for all active consents.

**Endpoint:** `GET /api/consent/manualrefresh`

**Response:** `204 No Content` (Async operation)

## Aggregate Data API

### Get Financial Overview

Get combined overview of banking and investment data.

**Endpoint:** `GET /api/v1/overview`

**Response:**
```json
{
    "total_assets": "1500000.00",
    "total_bank_balance": "500000.00",
    "total_investment_current_balance": "1000000.00",
    "accounts": {
        "bank_accounts": [
            {
                "fip_id": "BANK001",
                "fip_name": "Example Bank",
                "masked_account_number": "XXXX1234",
                "balance": "250000.00",
                "account_id": "acc-123",
                "type": "SAVINGS",
                "ifsc_code": "EXMP0001234"
            }
        ],
        "investment_accounts": {
            "mutual_funds": [...],
            "brokerages": [...],
            "etfs": [...]
        }
    },
    "last_fetched": "2023-12-21T10:00:00Z"
}
```

## Error Responses

All APIs return standard error responses:

```json
{
    "error": "Error message",
    "code": "ERROR_CODE",
    "detail": "Detailed error description"
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `SESSION_EXPIRED` | 401 | Session has expired |
| `UNAUTHORIZED` | 401 | Invalid or missing authentication |
| `FORBIDDEN` | 403 | Access denied |
| `NOT_FOUND` | 404 | Resource not found |
| `BAD_REQUEST` | 400 | Invalid request parameters |
| `INTERNAL_ERROR` | 500 | Server error |

## Rate Limits

- **Session APIs:** 10 requests/minute
- **Data APIs:** 100 requests/minute
- **Consent APIs:** 20 requests/minute
- **Manual Refresh:** 5 requests/hour

Rate limit headers:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1703155200
```

## Pagination

For APIs returning lists, use pagination parameters:

```http
GET /api/endpoint?page=1&limit=50
```

Response includes pagination metadata:
```json
{
    "data": [...],
    "pagination": {
        "page": 1,
        "limit": 50,
        "total": 200,
        "pages": 4
    }
}
```

## Webhooks

Configure webhooks to receive real-time notifications:

### Notification Types
- `CONSENT_STATUS_UPDATE`: Consent approved/rejected
- `FI_DATA_READY`: New financial data available
- `FI_DATA_FAILED`: Data fetch failed
- `INSIGHT_STATUS_UPDATE`: New insights generated

### Webhook Payload
```json
{
    "type": "CONSENT_STATUS_UPDATE",
    "timestamp": "2023-12-21T10:00:00Z",
    "data": {
        "consent_id": "consent-123",
        "status": "ACTIVE"
    }
}
```

## API Versioning

- Current version: v1
- Version specified in URL path
- Backward compatibility maintained for 6 months
- Deprecation notices provided 3 months in advance