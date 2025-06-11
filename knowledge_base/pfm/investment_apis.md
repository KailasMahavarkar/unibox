# Investment APIs

## Overview

Investment APIs provide access to user's investment portfolio data including mutual funds, equities, and ETFs with performance metrics and transaction history.

## Investment Overview API

Get consolidated view of all investments with current values and returns.

### Endpoint
`GET /api/v1/investment/overview`

### Response
```json
{
    "total_current_amount": "1500000.00",
    "total_invested_amount": "1200000.00",
    "total_absolute_return_rate": "25.00",
    "last_fetched": "2023-12-21T10:00:00Z",
    "mutual_funds": {
        "current_amount": "800000.00",
        "invested_amount": "650000.00",
        "absolute_return_rate": "23.08"
    },
    "brokerages": {
        "current_amount": "500000.00",
        "invested_amount": "400000.00",
        "absolute_return_rate": "25.00"
    },
    "etfs": {
        "current_amount": "200000.00",
        "invested_amount": "150000.00",
        "absolute_return_rate": "33.33"
    },
    "show_invested_value": true
}
```

### Response Fields
- **current_amount**: Current market value
- **invested_amount**: Total amount invested
- **absolute_return_rate**: Percentage returns
- **show_invested_value**: Feature flag for invested value display

## Mutual Fund APIs

### Get Mutual Fund Holdings

**Endpoint:** `GET /api/v1/investment/mutualfund`

**Response:**
```json
{
    "total_current_amount": "800000.00",
    "total_invested_amount": "650000.00",
    "total_absolute_return_rate": "23.08",
    "last_fetched": "2023-12-21T10:00:00Z",
    "holdings": [
        {
            "current_value": "300000.00",
            "invested_value": "250000.00",
            "absolute_return_rate": "20.00",
            "units": 2500.50,
            "fund_name": "ABC Large Cap Fund",
            "amc": "ABC Asset Management",
            "has_combined_values": false
        },
        {
            "current_value": "500000.00",
            "invested_value": "400000.00",
            "absolute_return_rate": "25.00",
            "units": 15000.00,
            "fund_name": "XYZ Balanced Fund",
            "amc": "XYZ Mutual Fund",
            "has_combined_values": true
        }
    ],
    "show_invested_value": true
}
```

**Note:** `has_combined_values` is true when the same fund is held across multiple accounts

## Equity APIs

### Get Equity Holdings

**Endpoint:** `GET /api/v1/investment/equities`

**Response:**
```json
{
    "total_current_amount": "500000.00",
    "total_invested_amount": "400000.00",
    "total_absolute_return_rate": "25.00",
    "last_fetched": "2023-12-21T10:00:00Z",
    "holdings": [
        {
            "current_value": "150000.00",
            "invested_value": "100000.00",
            "absolute_return_rate": "50.00",
            "units": 100,
            "issuer_name": "Reliance Industries",
            "broker": "Example Securities"
        },
        {
            "current_value": "350000.00",
            "invested_value": "300000.00",
            "absolute_return_rate": "16.67",
            "units": 500,
            "issuer_name": "TCS Limited",
            "broker": "Example Securities"
        }
    ],
    "show_invested_value": true
}
```

### Get Equity Transactions

**Endpoint:** `POST /api/v1/investment/transactions/equities`

**Request:**
```json
{
    "fromDate": "2023-01-01T00:00:00Z",
    "toDate": "2023-12-31T23:59:59Z",
    "accountIds": ["demat-123"]
}
```

**Response:**
```json
{
    "accounts": [
        {
            "fip_id": "BROKER001",
            "fip_name": "Example Securities",
            "broker_name": "Example Securities",
            "masked_account_number": "XXXX5678",
            "account_id": "demat-123",
            "holdings_count": 15,
            "current_value": "500000.00"
        }
    ],
    "last_fetched": "2023-12-21T10:00:00Z",
    "transactions": [
        {
            "accountId": "demat-123",
            "issuer_name": "Reliance Industries",
            "isin": "INE002A01018",
            "isinDescription": "RELIANCE INDUSTRIES LTD",
            "narration": "Buy 50 shares",
            "investment_type": "EQUITY",
            "rate": 2500.00,
            "units": 50,
            "type": "BUY",
            "amount": "125000.00",
            "date": "2023-12-15T10:30:00Z",
            "fip_id": "BROKER001",
            "fip_name": "Example Securities",
            "broker_name": "Example Securities"
        }
    ],
    "total_count": 45
}
```

## ETF APIs

### Get ETF Holdings

**Endpoint:** `GET /api/v1/investment/etfs`

**Response Structure:** Same as equity holdings

### Get ETF Transactions

**Endpoint:** `POST /api/v1/investment/transactions/etfs`

**Request/Response:** Same structure as equity transactions

## Combined Investment Transactions

Get transactions for both equities and ETFs in a single call.

### Endpoint
`POST /api/v1/investment/transactions`

### Request
```json
{
    "fromDate": "2023-01-01T00:00:00Z",
    "toDate": "2023-12-31T23:59:59Z",
    "accountIds": ["demat-123", "demat-456"]
}
```

### Response
```json
{
    "investment_accounts": {
        "brokerages": [...],
        "etfs": [...]
    },
    "last_fetched": "2023-12-21T10:00:00Z",
    "transactions": [
        {
            "accountId": "demat-123",
            "issuer_name": "Nifty 50 ETF",
            "investment_type": "ETF",
            "type": "BUY",
            "amount": "50000.00",
            "units": 250,
            "rate": 200.00,
            "date": "2023-12-10T11:00:00Z"
        }
    ],
    "total_count": 120
}
```

## Transaction Types

### Buy/Sell Transactions
- `BUY`: Purchase of securities
- `SELL`: Sale of securities

### Corporate Actions
- `DIVIDEND`: Dividend received
- `BONUS`: Bonus shares credited
- `SPLIT`: Stock split
- `MERGER`: Merger/demerger actions

## Investment Accounts Structure

### Mutual Fund Account
```json
{
    "amc": "ABC Asset Management",
    "fip_id": "AMC001",
    "fip_name": "ABC AMC",
    "masked_account_number": "XXXX1234",
    "current_value": "800000.00",
    "has_combined_values": false
}
```

### Demat Account (Equities/ETFs)
```json
{
    "broker_name": "Example Securities",
    "fip_id": "BROKER001",
    "fip_name": "Example Securities Ltd",
    "demat_id": "1234567890123456",
    "masked_account_number": "XXXX3456",
    "holdings_count": 25,
    "current_value": "700000.00"
}
```

## Performance Metrics

### Absolute Returns
```
Absolute Return % = ((Current Value - Invested Value) / Invested Value) * 100
```

### XIRR (Extended Internal Rate of Return)
- Considers timing of investments
- Available for mutual funds
- Calculated based on transaction history

## Data Considerations

### NAV Updates
- Mutual fund NAVs updated daily by 11 PM IST
- Equity/ETF prices updated during market hours
- Historical NAVs maintained for performance calculation

### Portfolio Valuation
- Current values based on latest available prices
- Invested values calculated from transaction history
- Corporate actions automatically adjusted

### Multi-Account Handling
- Same securities across accounts can be combined
- Account-wise breakdown available
- Consolidated view for portfolio analysis

## Best Practices

### Data Refresh
- Investment data auto-refreshed daily
- Manual refresh available but limited
- Check last_fetched for data currency

### Large Portfolios
- Use pagination for transaction history
- Filter by account for better performance
- Cache holdings data appropriately

### Corporate Actions
- Monitor transaction types for corporate actions
- Verify unit changes post-corporate actions
- Reconcile portfolio values periodically