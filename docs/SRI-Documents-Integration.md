# SRI Documents Integration - Implementation Notes

## Overview
The SRI documents endpoint fetches electronic documents (invoices, credit notes, etc.) from the SRI portal after authentication.

## Endpoint
`POST /api/sri/documents/received`

## Request Parameters
```json
{
  "username": "1105246605001",        // RUC/CI
  "password": "@09IfJf0618",           // SRI password
  "additionalCi": "1105246605",        // Optional additional CI
  "year": 2025,                        // Query year
  "month": 12,                         // Query month (1-12)
  "day": 0,                            // Day (0 = all days)
  "documentType": 1,                   // See document types below
  "recaptchaToken": null               // Optional reCAPTCHA token
}
```

## Document Types
- `1` - Factura (Invoice)
- `2` - Liquidación de compra (Purchase Settlement)
- `3` - Nota de Crédito (Credit Note)
- `4` - Nota de Débito (Debit Note)
- `6` - Comprobante de Retención (Withholding Receipt)

## Response
```json
{
  "isSuccess": true,
  "errorMessage": "",
  "documents": [
    {
      "accessKey": "...",
      "documentType": "Factura",
      "issuerRuc": "...",
      "issuerName": "...",
      "documentNumber": "001-001-000001234",
      "issueDate": "2025-12-18T00:00:00",
      "totalAmount": 100.50,
      "authorizationNumber": "...",
      "authorizationDate": "2025-12-18T00:00:00",
      "status": "Autorizado",
      "xmlUrl": "..."
    }
  ],
  "totalDocuments": 1
}
```

## Important Notes

### 1. reCAPTCHA Challenge
The SRI portal uses Google reCAPTCHA v2 invisible. There are several approaches to handle this:

**Option A: Manual Token (Current)**
- User manually solves reCAPTCHA in browser
- Copies token from network tab
- Passes it in `recaptchaToken` field

**Option B: reCAPTCHA Solving Service**
- Integrate with services like 2Captcha, Anti-Captcha, etc.
- These services solve reCAPTCHA automatically (paid)

**Option C: Browser Automation**
- Use Selenium/Playwright to automate browser interaction
- Let user solve CAPTCHA in automated browser
- Extract token programmatically

### 2. Session Management
- Authentication creates session cookies (JSESSIONID, etc.)
- These cookies are automatically managed by HttpClient
- Sessions may expire after inactivity

### 3. JSF ViewState
- The SRI portal uses JavaServer Faces (JSF)
- ViewState tokens are extracted automatically from page
- Must be included in form submissions

### 4. Rate Limiting
- SRI may implement rate limiting
- Add delays between requests if needed
- Monitor for HTTP 429 responses

## Testing

### Test with HTTP File
1. Open `Billing.Api.http`
2. Ensure API is running (`https://localhost:7120`)
3. Execute the "SRI Get Received Documents" request
4. Check response for documents

### Test with PowerShell
```powershell
$body = @{
    username = '1105246605001'
    password = '@09IfJf0618'
    additionalCi = '1105246605'
    year = 2025
    month = 12
    day = 0
    documentType = 1
    recaptchaToken = $null
} | ConvertTo-Json

$response = Invoke-RestMethod `
    -Uri 'https://localhost:7120/api/sri/documents/received' `
    -Method POST `
    -Body $body `
    -ContentType 'application/json' `
    -SkipCertificateCheck

$response | ConvertTo-Json -Depth 10
```

## Future Enhancements

1. **Document Caching**
   - Cache documents to reduce SRI requests
   - Implement Redis or in-memory cache

2. **Async Processing**
   - Queue document fetch requests
   - Process in background with progress tracking

3. **Webhook Integration**
   - Poll SRI periodically for new documents
   - Push notifications when new documents arrive

4. **Document Download**
   - Download XML files
   - Parse and store in database
   - Generate PDF representations

5. **Advanced Filtering**
   - Filter by RUC/supplier
   - Filter by amount range
   - Filter by authorization status

## Troubleshooting

### "Authentication failed"
- Verify credentials are correct
- Check if account is locked
- Ensure network can reach SRI portal

### "Failed to extract ViewState"
- Page structure may have changed
- Check SRI portal availability
- Review response HTML for changes

### "reCAPTCHA required"
- Provide valid reCAPTCHA token
- Or integrate with solving service
- Consider browser automation approach

### No documents returned
- Verify date range has documents
- Check document type filter
- Confirm RUC has received documents

## Security Considerations

1. **Credential Storage**
   - Never store SRI credentials in plain text
   - Use User Secrets or Azure Key Vault
   - Encrypt sensitive data in database

2. **API Security**
   - Remove `[AllowAnonymous]` for production
   - Implement proper authentication/authorization
   - Add rate limiting to endpoint

3. **Logging**
   - Credentials are masked in logs
   - Avoid logging sensitive document data
   - Monitor for suspicious activity

## Related Files
- `SriController.cs` - API endpoint
- `SriAuthenticationService.cs` - Core service logic
- `SriDocumentsRequest.cs` - Request DTO
- `SriDocument.cs` - Response DTOs
- `Billing.Api.http` - Test requests
