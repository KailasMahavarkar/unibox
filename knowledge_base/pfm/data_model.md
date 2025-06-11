# Data Models & Schemas

## Core Data Types

### User Object
```typescript
interface User {
    id: string;                    // Unique user identifier
    mobile_number: string;         // Masked mobile number
    pan: string;                   // Masked PAN
    customer_id?: string;          // Client's customer ID
    verified_pan: boolean;         // PAN verification status
    created_at: string;           // ISO8601 datetime
    updated_at: string;           // ISO8601 datetime
}
```

### Session Object
```typescript
interface Session {
    session_id: string;            // Unique session identifier
    user_id: number;              // User ID
    expiry: string;               // Session expiry (ISO8601)
    landing_page: string;         // Default UI page
    source: string;               // Source application
    is_expired: boolean;          // Session status
    version: string;              // API version
}
```

### Consent Object
```typescript
interface Consent {
    id: string;                   // Consent ID
    handle: string;               // Unique consent handle
    status: ConsentStatus;        // Consent status
    type: 'banking' | 'investment';
    accounts_linked: number;      // Number of linked accounts
    expiry: string;              // Consent expiry date
    updated_at: string;          // Last update time
}

enum ConsentStatus {
    PENDING = 'PENDING',
    ACTIVE = 'ACTIVE',
    REJECTED = 'REJECTED',
    REVOKED = 'REVOKED',
    EXPIRED = 'EXPIRED'
}
```

## Banking Data Models

### Bank Account
```typescript
interface BankAccount {
    account_id: string;           // Unique account identifier
    fip_id: string;              // Financial Information Provider ID
    fip_name: string;            // Bank name
    masked_account_number: string; // Masked account number
    link_ref_number: string;      // AA link reference
    type: AccountType;           // Account type
    ifsc_code: string;           // IFSC code
    balance?: string;            // Current balance
    status: string;              // Account status
    last_fetched?: string;       // Last data fetch time
    fetch_status: FetchStatus;   // Data fetch status
}

enum AccountType {
    SAVINGS = 'SAVINGS',
    CURRENT = 'CURRENT',
    FIXED_DEPOSIT = 'FIXED_DEPOSIT',
    RECURRING_DEPOSIT = 'RECURRING_DEPOSIT'
}
```

### Transaction
```typescript
interface Transaction {
    id?: string;                  // Transaction ID
    accountId: string;           // Account ID
    date: string;                // Transaction date
    narration: string;           // Transaction description
    value: string;               // Amount
    type: 'DEBIT' | 'CREDIT';   // Transaction type
    categoryL1: string;          // Primary category
    categoryL2: string;          // Secondary category
    categoryManual?: string;     // User-defined category
    closingBalance?: string;     // Balance after transaction
    fipId: string;              // FIP identifier
    fipName: string;            // Bank name
}
```

### Banking Overview
```typescript
interface BankingOverview {
    current_balance: string;
    monthly_categorical_summary: MonthlySummary[];
    income_expense_trend: MonthlyTrend[];
    top_five_transactions: TopTransactions[];
    accounts: BankAccount[];
    last_fetched: string;
}

interface MonthlySummary {
    month_year: string;
    monthly_data: CategoryAmount[];
}

interface CategoryAmount {
    category: string;
    amount: number;
}
```

## Investment Data Models

### Mutual Fund Holding
```typescript
interface MutualFundHolding {
    fund_name: string;           // Fund name
    amc: string;                 // Asset Management Company
    units: number;               // Number of units
    current_value: string;       // Current market value
    invested_value?: string;     // Amount invested
    absolute_return_rate?: string; // Returns percentage
    has_combined_values: boolean; // Multiple accounts flag
}
```

### Equity Holding
```typescript
interface EquityHolding {
    issuer_name: string;         // Company name
    broker: string;              // Broker name
    units: number;               // Number of shares
    current_value: string;       // Current market value
    invested_value?: string;     // Amount invested
    absolute_return_rate?: string; // Returns percentage
}
```

### Investment Account
```typescript
interface InvestmentAccount {
    account_id: string;
    fip_id: string;
    fip_name: string;
    masked_account_number: string;
    link_ref_number: string;
    status: string;
    last_fetched?: string;
    fetch_status: FetchStatus;
}

interface MutualFundAccount extends InvestmentAccount {
    amc: string;
    current_value?: string;
    has_combined_values: boolean;
}

interface DematAccount extends InvestmentAccount {
    demat_id: string;
    broker_name: string;
    holdings_count: number;
    current_value?: string;
}
```

### Investment Transaction
```typescript
interface InvestmentTransaction {
    accountId: string;
    date: string;
    type: TransactionType;
    investment_type: 'EQUITY' | 'ETF' | 'MUTUAL_FUND';
    issuer_name: string;
    isin?: string;
    isinDescription?: string;
    narration: string;
    units: number;
    rate: number;
    amount: string;
    fip_id: string;
    fip_name: string;
    broker_name?: string;
}

enum TransactionType {
    BUY = 'BUY',
    SELL = 'SELL',
    DIVIDEND = 'DIVIDEND',
    BONUS = 'BONUS',
    SPLIT = 'SPLIT'
}
```

## Common Enums & Types

### Fetch Status
```typescript
enum FetchStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}
```

### Summary Status
```typescript
enum SummaryStatus {
    SUMMARY_AVAILABLE = 'SUMMARY_AVAILABLE',
    SUMMARY_NOT_AVAILABLE = 'SUMMARY_NOT_AVAILABLE',
    SUMMARY_PENDING = 'SUMMARY_PENDING'
}
```

### Date Formats
All dates in the API follow ISO 8601 format:
- Full datetime: `2023-12-21T10:30:00.000Z`
- Date only: `2023-12-21`

### Amount Format
All monetary values are strings with 2 decimal places:
- Example: `"1500000.00"`
- No currency symbols
- Indian numbering system

## Response Wrappers

### Success Response
```typescript
interface SuccessResponse<T> {
    data?: T;
    message?: string;
}
```

### Error Response
```typescript
interface ErrorResponse {
    error: string;
    code: string;
    detail?: string;
}
```

### Paginated Response
```typescript
interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
```

## Webhook Payloads

### Consent Notification
```typescript
interface ConsentNotification {
    type: 'CONSENT_STATUS_UPDATE';
    consentId: string;
    data: {
        consent_id: string;
        status: ConsentStatus;
        timestamp: string;
    };
}
```

### Data Ready Notification
```typescript
interface DataReadyNotification {
    type: 'FI_DATA_READY';
    consentId: string;
    data: {
        account_ids: string[];
        fi_types: string[];
        timestamp: string;
    };
}
```

## Validation Rules

### Mobile Number
- 10 digits
- Must start with 6, 7, 8, or 9
- Pattern: `^[6-9]\d{9}$`

### PAN Number
- 10 characters
- Pattern: `^[A-Z]{5}[0-9]{4}[A-Z]$`

### Account IDs
- UUID format
- Pattern: `^[0-9a-fA-F-]+$`

### Date Ranges
- Maximum range: 1 year
- From date must be before to date
- Cannot request future dates

## Feature Flags

Some features are controlled by backend flags:
```typescript
interface FeatureFlags {
    show_invested_value: boolean;      // Show investment cost basis
    enable_manual_refresh: boolean;     // Allow manual data refresh
    pdf_generation: boolean;           // Enable PDF statements
    transaction_categorization: boolean; // Auto-categorize transactions
}
```