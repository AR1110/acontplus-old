# SRI Documents Flow - Complete Implementation Guide

## Summary

The current implementation authenticates successfully but fails to retrieve documents because:
1. **Cookie Management**: Cookies from authentication aren't properly maintained in the session
2. **HttpClient Reuse**: Using the same `_httpClient` instance doesn't preserve cookies
3. **Session Validation**: No check if we get redirected back to login page

## The Correct Flow

### Step 1: Authentication ✅ (Working)
```
POST https://srienlinea.sri.gob.ec/auth/realms/Internet/login-actions/authenticate
Returns: KC_RESTART, AUTH_SESSION_ID, BIGipServerDecla_Sesion cookies
```

### Step 2: Navigate to Documents Page (Needs Fix)
```
GET https://srienlinea.sri.gob.ec/comprobantes-electronicos-internet/pages/consultas/recibidos/comprobantesRecibidos.jsf

MUST include cookies from Step 1
MUST check if response contains login page (session expired)
MUST extract javax.faces.ViewState from page
```

#### Browser Request Trace (Dec 18, 2025)
When the page is loaded in a normal browser session (Network tab capture), the following requests are triggered in order:

1. `GET .../comprobantesRecibidos.jsf` → main HTML (requires authenticated cookies)
2. Static assets: `styles_ltr.css`, `detect_angular_for_extension_icon_bundle.js`, `favicon.ico`
3. reCAPTCHA bootstrap (served from `www.gstatic.com/recaptcha/releases/.../recaptcha__es.js`)
4. reCAPTCHA iframe stack:
  - `https://www.google.com/recaptcha/api2/anchor?ar=1&k=6LemEY4UAAAAAHVQd7ZyoCoqBKNoWrcU04b5H-SP&...`
  - `https://www.google.com/recaptcha/api2/bframe?hl=es&k=6LemEY4UAAAAAHVQd7ZyoCoqBKNoWrcU04b5H-SP&...`
5. Token lifecycle endpoints fired by the iframe:
  - `reload?k=6LemEY4UAAAAAHVQd7ZyoCoqBKNoWrcU04b5H-SP`
  - `userverify?k=6LemEY4UAAAAAHVQd7ZyoCoqBKNoWrcU04b5H-SP`
  - `clr?k=6LemEY4UAAAAAHVQd7ZyoCoqBKNoWrcU04b5H-SP`
6. Telemetry/gif pings: `vm.gif`, `webworker.js`, `recaptcha__es.js`

🔎 **Implication**: the page always expects the Google reCAPTCHA widget to initialize and eventually provide the `g-recaptcha-response` token. When we call the JSF AJAX endpoint from the backend without generating this token, SRI silently kicks us back to the login page. Any backend-only solution must either:

- Supply a valid token (solve the challenge or reuse one captured from a headless browser), or
- Emulate these calls with Playwright/Selenium to harvest the token before submitting the JSF form.

### Step 3: Submit JSF AJAX Query (Needs Fix)
```
POST https://srienlinea.sri.gob.ec/comprobantes-electronicos-internet/pages/consultas/recibidos/comprobantesRecibidos.jsf

Headers:
  - Cookie: (from authentication)
  - Accept: application/xml, text/xml, */*; q=0.01
  - X-Requested-With: XMLHttpRequest
  - Faces-Request: partial/ajax
  - Referer: (documents page URL)

Body (application/x-www-form-urlencoded):
  - javax.faces.partial.ajax=true
  - javax.faces.source=frmPrincipal:j_idt37
  - javax.faces.partial.execute=@all
  - javax.faces.partial.render=frmPrincipal:panelListaComprobantes frmPrincipal:tablaCompRecibidos
  - frmPrincipal:j_idt37=frmPrincipal:j_idt37
  - frmPrincipal=frmPrincipal
  - frmPrincipal:opciones=ruc
  - frmPrincipal:ano=2025
  - frmPrincipal:mes=12
  - frmPrincipal:dia=0
  - frmPrincipal:cmbTipoComprobante=1
  - g-recaptcha-response=(token or empty)
  - javax.faces.ViewState=(from step 2)
```

### Using Existing Browser Session (New DTO property)

The `SriDocumentsRequest` DTO now accepts an optional `cookies` dictionary. Populate it with the raw name/value pairs captured from a successful browser login (Developer Tools → Application → Cookies). When provided, the backend skips the `Authenticate` call and reuses that session—useful when the user already solved the reCAPTCHA challenge manually. Example payload:

```json
{
  "username": "1105246605001",
  "password": "@09IfJf0618",
  "year": 2025,
  "month": 12,
  "day": 0,
  "documentType": 1,
  "recaptchaToken": null,
  "cookies": {
    "KC_RESTART": "...",
    "AUTH_SESSION_ID": "...",
    "BIGipServerDecla_Sesion": "...",
    "TS01ed1cee": "...",
    "TS01d1411e": "..."
  }
}
```

⚠️ Cookies remain valid only for a short time; expect to refresh them whenever SRI expires the session.

### Step 4: Parse JSF Response
Response is XML with CDATA sections containing HTML:
```xml
<?xml version="1.0" encoding="utf-8"?>
<partial-response>
  <changes>
    <update id="frmPrincipal:panelListaComprobantes">
      <![CDATA[...HTML with document table...]]>
    </update>
  </changes>
</partial-response>
```

## Key Fix Required

### Replace in `GetReceivedDocumentsAsync`:

**Current Problem:**
```csharp
// Cookies are added as header string, but HttpClient doesn't maintain them
initialRequest.Headers.Add("Cookie", cookieHeader);
var initialResponse = await _httpClient.SendAsync(initialRequest);
```

**Solution:**
```csharp
// Create HttpClient with CookieContainer for proper session management
using var handler = new HttpClientHandler
{
    AllowAutoRedirect = true,
    UseCookies = true,
    CookieContainer = new System.Net.CookieContainer()
};

// Add auth cookies to container
var uri = new Uri("https://srienlinea.sri.gob.ec");
foreach (var cookie in authResult.Cookies)
{
    handler.CookieContainer.Add(uri, new System.Net.Cookie(cookie.Key, cookie.Value));
}

using var sessionClient = new HttpClient(handler);
// Now use sessionClient for all requests - cookies will be maintained
```

### Update `BuildFormData` method name to `BuildJsfAjaxFormData`:

Remove `frmPrincipal:txtParametro` (it's disabled/readonly, uses logged-in user automatically)

```csharp
private Dictionary<string, string> BuildJsfAjaxFormData(SriDocumentsRequest request, string viewState)
{
    return new Dictionary<string, string>
    {
        { "javax.faces.partial.ajax", "true" },
        { "javax.faces.source", "frmPrincipal:j_idt37" },
        { "javax.faces.partial.execute", "@all" },
        { "javax.faces.partial.render", "frmPrincipal:panelListaComprobantes frmPrincipal:tablaCompRecibidos" },
        { "frmPrincipal:j_idt37", "frmPrincipal:j_idt37" },
        { "frmPrincipal", "frmPrincipal" },
        { "frmPrincipal:opciones", "ruc" },
        { "frmPrincipal:ano", request.Year.ToString() },
        { "frmPrincipal:mes", request.Month.ToString() },
        { "frmPrincipal:dia", request.Day.ToString() },
        { "frmPrincipal:cmbTipoComprobante", ((int)request.DocumentType).ToString() },
        { "g-recaptcha-response", request.RecaptchaToken ?? "" },
        { "javax.faces.ViewState", viewState }
    };
}
```

### Add Session Validation:

After fetching documents page, check for login redirect:
```csharp
var pageHtml = await sessionClient.GetAsync(documentsPageUrl);
if (pageHtml.Contains("kc-form-login") || pageHtml.Contains("login-pf"))
{
    return new SriDocumentsResponse
    {
        IsSuccess = false,
        ErrorMessage = "Session expired - cookies invalid"
    };
}
```

### Improve Response Parsing:

```csharp
private List<SriDocument> ParseJsfPartialResponse(string responseXml)
{
    var documents = new List<SriDocument>();

    // Extract CDATA sections containing HTML
    var cdataMatches = Regex.Matches(responseXml, @"<!\[CDATA\[(.*?)\]\]>", RegexOptions.Singleline);

    foreach (Match cdataMatch in cdataMatches)
    {
        var htmlContent = cdataMatch.Groups[1].Value;

        // Find table rows: <tr class="rf-dt-r ...">
        var rowMatches = Regex.Matches(
            htmlContent,
            @"<tr[^>]*class=""[^""]*rf-dt-r[^""]*""[^>]*>(.*?)</tr>",
            RegexOptions.Singleline);

        foreach (Match rowMatch in rowMatches)
        {
            var doc = ParseDocumentRow(rowMatch.Groups[1].Value);
            if (doc != null)
                documents.Add(doc);
        }
    }

    return documents;
}
```

## Testing

The authentication works perfectly. To test documents retrieval:

1. **Without reCAPTCHA** (may work initially):
   ```json
   {
     "username": "1105246605001",
     "password": "@09IfJf0618",
     "additionalCi": "1105246605",
     "year": 2025,
     "month": 12,
     "day": 0,
     "documentType": 1,
     "recaptchaToken": null
   }
   ```

2. **With reCAPTCHA token** (for production):
   - Get token from browser (F12 > Network > look for g-recaptcha-response)
   - Or integrate with 2Captcha/Anti-Captcha service
   - Or use browser automation (Selenium/Playwright)

## Next Steps

1. Apply the HttpClient CookieContainer fix
2. Add session validation
3. Update form data builder
4. Test with real data
5. Consider reCAPTCHA integration for production use

The authentication is solid - just need proper session management!
