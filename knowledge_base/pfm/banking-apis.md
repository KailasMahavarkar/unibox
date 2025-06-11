# Banking APIs

## Overview

Banking APIs provide access to user's bank account data including balances, transactions, spending patterns, and insights.

## Banking Overview API

Get comprehensive banking data summary including balances, spending trends, and top transactions.

### Endpoint
`POST /api/v1/banking/overview`

### Request
```json
{
    "account_ids": ["account-123", "account-456"]
}
```
*Note: Pass empty array to get data for all accounts*

### Response
```json
{
    "current_balance": "500000.00",
    "monthly_categorical_summary": [
        {
            "month_year": "2023-12",
            "monthly_data": [
                {
                    "category": "Food & Dining",
                    "amount": 15000.50
                },
                {
                    "category": "Transportation",
                    "amount": 8000.00
                }
            ]
        }
    ],
    "income_expense_trend": [
        {
            "month_year": "2023-12",
            "income": [
                {"x": "2023-12-01", "y": 100000.00},
                {"x": "2023-12-15", "y": 50000.00}
            ],
            "expense": [
                {"x": "2023-12-01", "y": 25000.00},
                {"x": "2023-12-10", "y": 15000.00}
            ],
            "balance": [
                {"x": "2023-12-01", "y": 475000.00},
                {"x": "2023-12-31", "y": 500000.00}
            ]
        }
    ],
    "top_five_transactions": [
        {
            "month_year": "2023-12",
            "credits": [
                {
                    "narration": "Salary Credit",
                    "value": "100000.00",
                    "date": "2023-12-01",
                    "type": "CREDIT",
                    "categoryL1": "Income",
                    "categoryL2": "Salary",
                    "bank_name": "Example Bank"
                }
            ],
            "debits": [
                {
                    "narration": "House Rent",
                    "value": "25000.00",
                    "date": "2023-12-05",
                    "type": "DEBIT",
                    "categoryL1": "Bills",
                    "categoryL2": "Rent",
                    "bank_name": "Example Bank"
                }
            ],
            "merchants": [
                {
                    "name": "Amazon",
                    "amount": "15000.00",
                    "transactions": [...]
                }
            ]
        }
    ],
    "accounts": [
        {
            "fip_id": "BANK001",
            "fip_name": "Example Bank",
            "status": "ACTIVE",
            "masked_account_number": "XXXX1234",
            "balance": "300000.00",
            "account_id": "account-123",
            "type": "SAVINGS",
            "ifsc_code": "EXMP0001234"
        }
    ],
    "last_fetched": "2023-12-21T10:00:00Z"
}
```

## Banking Transactions API

Get detailed transaction history with filtering and sorting options.

### Endpoint
`POST /api/v1/banking/transactions`

### Request
```json
{
    "categories": ["Food & Dining", "Transportation"],
    "accountIds": ["account-123"],
    "fromDate": "2023-12-01T00:00:00Z",
    "toDate": "2023-12-31T23:59:59Z",
    "orderBy": "desc"
}
```

### Request Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| categories | array | No | Filter by transaction categories |
| accountIds | array | No | Filter by account IDs |
| fromDate | string | No | Start date (ISO8601) |
| toDate | string | No | End date (ISO8601) |
| orderBy | string | No | Sort order: "asc" or "desc" |

### Response
```json
{
    "accounts": [
        {
            "fip_id": "BANK001",
            "fip_name": "Example Bank",
            "masked_account_number": "XXXX1234",
            "accountId": "account-123"
        }
    ],
    "last_fetched": "2023-12-21T10:00:00Z",
    "transactions": [
        {
            "narration": "Payment to Restaurant XYZ",
            "value": "1500.00",
            "date": "2023-12-20T18:30:00Z",
            "fipName": "Example Bank",
            "fipId": "BANK001",
            "categoryL1": "Food & Dining",
            "categoryL2": "Restaurants",
            "type": "DEBIT",
            "accountId": "account-123",
            "closingBalance": "298500.00"
        }
    ]
}
```

## Update Transaction Category

Manually update the category of a transaction.

### Endpoint
`PATCH /api/banking/transaction/update-category`

### Request
```json
{
    "id": "transaction-123",
    "accountId": "account-123",
    "categoryManual": "Business Expense",
    "categoryL1": "Business",
    "categoryL2": "Office Supplies"
}
```

### Response
```json
{
    "message": "Category updated successfully"
}
```

## Transaction Categories

### Available Categories (Level 1)
- Income
- Food & Dining
- Transportation
- Shopping
- Bills & Utilities
- Entertainment
- Healthcare
- Education
- Travel
- Investments
- Transfers
- Cash Withdrawal
- Others

### Category Hierarchy
Each transaction has two levels of categorization:
- **categoryL1**: Main category (e.g., "Food & Dining")
- **categoryL2**: Subcategory (e.g., "Restaurants")

## Bank Statement PDFs

### Generate PDF Statement

Generate a PDF bank statement for selected accounts and date range.

**Endpoint:** `POST /api/report`

**Request:**
```json
{
    "accounts": ["account-123", "account-456"],
    "fromDate": "2023-12-01T00:00:00Z",
    "toDate": "2023-12-31T23:59:59Z"
}
```

**Response:**
```json
{
    "id": "report-123",
    "status": "AVAILABLE",
    "location": "reports/2023/12/statement-123.pdf",
    "download_url": "https://pfm.setu.co/download/xxxxx"
}
```

**Status Values:**
- `AVAILABLE`: PDF ready for download (≤200 transactions)
- `TRIGGERED`: PDF generation in progress (>200 transactions)

### List Generated PDFs

Get list of previously generated PDF statements.

**Endpoint:** `GET /api/report/list`

**Response:**
```json
[
    {
        "id": "report-123",
        "status": "AVAILABLE",
        "trigger": "2023-12-21T10:00:00Z",
        "location": "reports/2023/12/statement-123.pdf"
    }
]
```

### Get Download URL

Get temporary download URL for a PDF statement.

**Endpoint:** `GET /api/report/presign-url?pdf_id=report-123`

**Response:**
```json
{
    "url": "https://s3.amazonaws.com/pfm-reports/xxxxx?signature=yyyy"
}
```

*Note: Pre-signed URLs are valid for 5 minutes only*

## Data Insights

Banking APIs automatically provide insights including:

### Spending Patterns
- Monthly spending by category
- Merchant-wise analysis
- Unusual spending detection

### Income Analysis
- Income sources identification
- Income stability metrics
- Salary credit patterns

### Balance Trends
- Daily balance tracking
- Month-end balance predictions
- Low balance alerts

## Best Practices

### Performance Optimization
1. Use account filters to reduce response size
2. Request specific date ranges (max 1 year recommended)
3. Cache overview data and refresh periodically

### Data Freshness
- Data is auto-refreshed daily at 6 AM IST
- Manual refresh available via consent API
- Check `last_fetched` timestamp for data currency

### Transaction Handling
- Store transaction IDs for reconciliation
- Handle duplicate transactions (same amount, date, narration)
- Respect user's manual category updates