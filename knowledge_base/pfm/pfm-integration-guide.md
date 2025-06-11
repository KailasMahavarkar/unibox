# Setu PFM Integration Guide

**Version:** 1.12  
**Date Updated:** Oct 3, 2024  
**Authors:** Gandharva R Bettadapur, Aditya Gannavarapu, Shrivatsa Swadi, Abhishek Jha  
**Purpose:** Integration with Setu PFM solution

## Table of Contents

- [Endpoints and Credentials](#endpoints-and-credentials)
- [Initiate a Customer](#initiate-a-customer-logged-inauthenticated)
- [Integration Methods](#integration-methods)
- [Close PFM and Return Customer](#close-pfm-and-return-customer)
- [Appendix](#appendix)

## Endpoints and Credentials

### UAT

**Endpoints:**
- Frontend: `https://*pfm-uat.setu.co`
- Backend: `https://*pfm-uat-api.setu.co`

**URLs:**
- Backend: `{backend_endpoint}/api/session`
- Frontend: `{frontend_endpoint}/home?payload=xxx`

**Credentials:**
- **Auth Header (x-api-key):** To be provided by Setu
- **Encryption Key (encryption_key):** To be provided by Setu
- **Referrer Source:** Single word without special characters (provided by customer)

### Production

**Endpoints:**
- Frontend: `https://*pfm.setu.co`
- Backend: `https://*pfm-api.setu.co`

**URLs:**
- Backend: `{backend_endpoint}/api/session`
- Frontend: `{frontend_endpoint}/home?payload=xxx`

**Credentials:**
- **Auth Header (x-api-key):** To be provided by Setu
- **Encryption Key (encryption_key):** To be provided by Setu
- **Referrer Source:** Single word without special characters (provided by customer)

## Initiate a customer (logged-in/authenticated)

Client backend will initiate a session every time a user clicks on the link to Setu PFM.

### Payload JSON Schema

| Fields | Type | Validation | Required |
|--------|------|------------|----------|
| mobileNumber | String | 10 digit number. Starts with 6/7/8/9. | Yes |
| panNumber | String | 10 character PAN number | No (optional) |
| customerId | String | ^[0-9a-fA-F-]+$ | No (optional) |
| expiry | DateTime | ISO 8601 format | No (optional) |
| source | String | Customer-defined Referrer source | Yes |
| landingPage | String | Set of strings defined by setu as per customer requirements | Yes (default is main_summary) |

### Sample Raw Payload in JSON

```json
{
  "mobileNumber": "9876543210",
  "panNumber": "UGTFS4887H",
  "source": "xyz",
  "landingPage": "main_summary",
  "expiry": "2023-12-21T13:17:07.167099"
}
```

### Encryption of payload

- **Algorithm:** AES-256
- **Mode:** CBC
- **EncryptionKey:** Provided by Setu

## API to create session

```http
POST {BACKEND_ENDPOINT}/api/session
Content-Type: text/plain
x-api-key: {YOUR_API_KEY}

{ENCRYPTED_PAYLOAD}
```

### Request Example

```
ZHRShbWsnqmUsV1NktgGhXRg4v6ENRAlaB/R+/ktyiaLmJzs4DhdTsyPLJUo55qp+2ARlQaN8CiBIsFq3/P4Q+/w9b3AGnQLP5lnWhfOCt+odshRf6S5CJzpuTdpZ9kNitfMc3lYx+r97N1L8MjoDHJJaUlJtUEtE83NxqpTqlHZkWy8PaCYaJyC6DOWetqZOvxYSxUbf9MQYyyg5c/acDv3B6pSmHQ5ybj04Fzjbf4=
```

### Response Payload

#### 200 - Success

```json
{
  "data": "aCB9pIpFCrqGno8aeytIy%2BhtSG61TiTKHM%2FWtGfsTKVp1Jui8gtKiDTH8SaXhnBHLHbpVeJZyfrgT06GMDKFcgnhLvLwu%2BSITPNj%2F1ZFGajS%2BLPtT947ORq5aYZmO2UAHYtqN65BJH6e%2FPoEI5XGUnhpsGGhjxqkCr3c1933B%2Fk%3D"
}
```

To decrypt the response payload, you need to URL decode the value of "data" and then decrypt it using the same encryption key. This is an optional step to perform.

**Decryption of Sample Response yields:**

```json
{
  "sessionId": "uuid-uuid-uuid-uuid",
  "expiresAt": "2023-07-01T00:00.000Z"
}
```

> **Note:** Error responses are not encrypted.

#### 400 - Bad Request

```json
{
  "detail": "Could not decode payload"
}
```

```json
{
  "detail": "Could not decrypt payload"
}
```

```json
{
  "detail": "Could not create session"
}
```

#### 403 - Forbidden

```json
{
  "detail": "Could not validate credentials"
}
```

#### 500 - Internal Server Error

```json
{
  "detail": "Something went wrong"
}
```

## Integration methods

### 1. WebView

Once the session is created, the client will pass the encrypted response from the session API as query params.

Client app will load the above URL using a web view. An example code of webview:

```java
WebView myWebView = (WebView) findViewById(R.id.webview);
WebSettings webSettings = myWebView.getSettings();
webSettings.setJavaScriptEnabled(true);
webview.loadUrl("{{FRONTEND_ENDPOINT}}/home?payload=aCB9pIpFCrqGno8aeytIy%2BhtSG61TiTKHM%2FWtGfsTKVp1Jui8gtKiDTH8SaXhnBHLHbpVeJZyfrgT06GMDKFcgnhLvLwu%2BSITPNj%2F1ZFGajS%2BLPtT947ORq5aYZmO2UAHYtqN65BJH6e%2FPoEI5XGUnhpsGGhjxqkCr3c1933B%2Fk%3D");
```

### 2. Redirection

Once the session is created, client will pass the encrypted response from the session API as query params like so:

```
{{FRONTEND_ENDPOINT}}/home?payload=aCB9pIpFCrqGno8aeytIy%2BhtSG61TiTKHM%2FWtGfsTKVp1Jui8gtKiDTH8SaXhnBHLHbpVeJZyfrgT06GMDKFcgnhLvLwu%2BSITPNj%2F1ZFGajS%2BLPtT947ORq5aYZmO2UAHYtqN65BJH6e%2FPoEI5XGUnhpsGGhjxqkCr3c1933B%2Fk%3D
```

## Close PFM and Return Customer

### Integration methods

#### 1. WebView

Since the PFM app is loaded inside a webview, the webview host app has control of when to exit. When the user chooses to exit, the webview will redirect to this endpoint: `{{FRONTEND_ENDPOINT}}/exit`

The host app can listen to this URL change and can close the webview. Example code below:

```java
public class MyWebViewClient extends WebViewClient {
    @Override
    public boolean shouldOverrideUrlLoading(WebView view, String url) {
        if (url.equals("{frontend_endpoint}/exit")) {
            finish();
            // perform your action here
            return true;
        } else {
            view.loadUrl(url);
            return true;
        }
    }
}
```

#### 2. Redirection

As the user is redirected to a new tab, redirecting back to RIB is not possible. User can choose to close the tab and PFM app will have its own session timeout.

## Appendix

### Sample Java code for Encryption

```java
import java.nio.charset.StandardCharsets;
import java.util.Random;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import javax.crypto.Cipher;
import java.util.Arrays;

public class Test {

    public static String encrypt(String key, String plaintext) {
        try {
            // Generate a random 16-byte initialization vector
            byte initVector[] = new byte[16];
            (new Random()).nextBytes(initVector);
            IvParameterSpec iv = new IvParameterSpec(initVector);

            // prep the key
            SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes("UTF-8"), "AES");

            // prep the AES Cipher
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
            cipher.init(Cipher.ENCRYPT_MODE, skeySpec, iv);

            // Encode the plaintext as array of Bytes
            byte[] cipherbytes = cipher.doFinal(plaintext.getBytes());

            // Build the output message initVector + cipherbytes -> base64
            byte[] messagebytes = new byte[initVector.length + cipherbytes.length];

            System.arraycopy(initVector, 0, messagebytes, 0, 16);
            System.arraycopy(cipherbytes, 0, messagebytes, 16, cipherbytes.length);

            // Return the cipherbytes as a Base64-encoded string
            return Base64.getEncoder().encodeToString(messagebytes);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }

    // Base64-encoded String ciphertext -> String plaintext
    public static String decrypt(String key, String ciphertext) {
        try {
            byte[] cipherbytes = Base64.getDecoder().decode(ciphertext);

            byte[] initVector = Arrays.copyOfRange(cipherbytes, 0, 16);

            byte[] messagebytes = Arrays.copyOfRange(cipherbytes, 16, cipherbytes.length);

            IvParameterSpec iv = new IvParameterSpec(initVector);
            SecretKeySpec skeySpec = new SecretKeySpec(key.getBytes("UTF-8"), "AES");

            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
            cipher.init(Cipher.DECRYPT_MODE, skeySpec, iv);

            // Convert the ciphertext Base64-encoded String back to bytes, and
            // then decrypt
            byte[] byte_array = cipher.doFinal(messagebytes);

            // Return plaintext as String
            return new String(byte_array, StandardCharsets.UTF_8);
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return null;
    }

    public static void main(String args[]) throws Exception {
        String key = "setupfm123456789";
        String clean = "{\"mobileNumber\": \"9742427666\",\"source\": \"imobile\",\"landingPage\": \"main_summary\",\"expiry\": \"2023-07-01T11:20.000Z+\"}";
        String encrypted = encrypt(key, clean);
        System.out.println(encrypted);
    }
}
```

---

**End of Document** 