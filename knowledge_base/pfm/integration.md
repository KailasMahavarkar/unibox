# Setu PFM Integration Guide

## Prerequisites

Before integrating with Setu PFM, ensure you have:
- API credentials (API key) from Setu team
- Encryption key for payload encryption
- Configured redirect URLs for consent handling

## Integration Flow

### Step 1: Create Session

Every user interaction starts with creating a session. Sessions are valid for 10 minutes and can be refreshed.

#### Payload Structure
```json
{
    "mobileNumber": "9876543210",
    "panNumber": "UGTFS4887H",
    "customerId": "unique-customer-id",
    "source": "your-app-name",
    "landingPage": "main_summary",
    "expiry": "2023-12-21T13:17:07.167099",
    "shouldRefreshData": true
}
```

#### Encryption
- Algorithm: AES-256
- Mode: CBC
- Encrypt the payload using the provided encryption key

### Step 2: Make Session API Call

```http
POST /api/session
Content-Type: text/plain
x-api-key: YOUR_API_KEY

[ENCRYPTED_PAYLOAD]
```

The response contains an encrypted session token that needs to be passed to the frontend.

### Step 3: Frontend Integration

#### WebView Integration

```java
WebView myWebView = (WebView) findViewById(R.id.webview);
WebSettings webSettings = myWebView.getSettings();
webSettings.setJavaScriptEnabled(true);
webview.loadUrl("{{FRONTEND_ENDPOINT}}/home?payload=[ENCRYPTED_RESPONSE]");
```

Handle exit navigation:
```java
public class MyWebViewClient extends WebViewClient {
    @Override
    public boolean shouldOverrideUrlLoading(WebView view, String url) {
        if (url.equals("{frontend_endpoint}/exit")) {
            finish();
            return true;
        } else {
            view.loadUrl(url);
            return true;
        }
    }
}
```

#### Redirect Integration

Simply redirect users to:
```
{{FRONTEND_ENDPOINT}}/home?payload=[ENCRYPTED_RESPONSE]
```

### Step 4: Login API

After frontend loads, it will call the login API with the encrypted payload:

```http
POST /api/session/login
Content-Type: application/json

{
    "data": "[ENCRYPTED_PAYLOAD]"
}
```

This returns:
- User details
- Session information
- JWT token (set as cookie)

### Step 5: Handle User Consent

Users need to provide consent for data access:

1. **Banking Consent**: For bank account data
2. **Investment Consent**: For mutual funds, equities, and ETF data

After consent approval, users are redirected back to your configured redirect URL.

## Best Practices

### Session Management
- Always check session expiry before making API calls
- Implement session refresh logic for long user sessions
- Handle session expiry gracefully in the UI

### Error Handling
- Implement proper error handling for all API calls
- Show user-friendly error messages
- Log errors for debugging

### Security
- Never expose encryption keys in client-side code
- Always use HTTPS for API communications
- Validate all inputs before encryption

### Performance
- Cache session data appropriately
- Implement loading states during API calls
- Handle network failures gracefully

## Testing

### UAT Environment
Use UAT endpoints for testing:
- Frontend: `https://*pfm-uat.setu.co`
- Backend: `https://*pfm-uat-api.setu.co`

### Test Scenarios
1. New user registration flow
2. Existing user login
3. Consent approval and rejection
4. Data refresh scenarios
5. Session expiry handling
6. Error scenarios

## Common Issues

### Session Expired
- Solution: Create a new session or refresh existing session

### Encryption/Decryption Errors
- Verify encryption key is correct
- Ensure proper encoding/decoding of payloads
- Check for special characters in payload

### Consent Not Approved
- Guide users to complete consent flow
- Handle consent rejection gracefully
- Provide option to retry consent

## Support

For technical support and queries:
- Check API documentation for detailed specifications
- Contact Setu support team for integration assistance