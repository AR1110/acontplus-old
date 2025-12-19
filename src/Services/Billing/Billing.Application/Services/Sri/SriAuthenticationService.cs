using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.RegularExpressions;
using Billing.Application.Dtos;
using Billing.Application.Interfaces.Sri;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Playwright;

namespace Billing.Application.Services.Sri;

public class SriAuthenticationService : ISriAuthenticationService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<SriAuthenticationService> _logger;
    private readonly SriAuthenticationOptions _options;
    private readonly IRecaptchaSolver _recaptchaSolver;
    private readonly RecaptchaSolverOptions _recaptchaSolverOptions;

    public SriAuthenticationService(
        HttpClient httpClient,
        ILogger<SriAuthenticationService> logger,
        IOptions<SriAuthenticationOptions> options,
        IRecaptchaSolver recaptchaSolver,
        IOptions<RecaptchaSolverOptions> recaptchaSolverOptions)
    {
        _httpClient = httpClient;
        _logger = logger;
        _options = options.Value;
        _recaptchaSolver = recaptchaSolver;
        _recaptchaSolverOptions = recaptchaSolverOptions.Value;

        ConfigureHttpClient();
    }

    private void ConfigureHttpClient()
    {
        _httpClient.BaseAddress = new Uri(_options.BaseUrl);
        _httpClient.Timeout = TimeSpan.FromSeconds(_options.TimeoutSeconds);
        _httpClient.DefaultRequestHeaders.Clear();

        // Configure headers to mimic a browser
        _httpClient.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
        _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("text/html"));
        _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/xhtml+xml"));
        _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/xml", 0.9));
        _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("image/avif"));
        _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("image/webp"));
        _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("*/*", 0.8));
        _httpClient.DefaultRequestHeaders.AcceptLanguage.Add(new StringWithQualityHeaderValue("es-ES"));
        _httpClient.DefaultRequestHeaders.AcceptLanguage.Add(new StringWithQualityHeaderValue("es", 0.9));
        _httpClient.DefaultRequestHeaders.AcceptLanguage.Add(new StringWithQualityHeaderValue("en", 0.8));
        _httpClient.DefaultRequestHeaders.Add("Cache-Control", "no-cache");
        _httpClient.DefaultRequestHeaders.Add("Pragma", "no-cache");
    }

    public async Task<SriAuthenticationResult> AuthenticateAsync(string username, string password, string? additionalCi = null)
    {
        try
        {
            // Validate input parameters
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                return new SriAuthenticationResult
                {
                    IsSuccess = false,
                    ErrorMessage = "Username and password are required"
                };
            }

            // Validate username format (should be numeric for RUC/CI)
            if (!ValidateIdentification(username))
            {
                _logger.LogWarning("Invalid identification format: {Username}", MaskUsername(username));
            }

            _logger.LogInformation("Starting authentication for user: {Username}", MaskUsername(username));

            // Step 1: Initiate authorization request
            var authResult = await InitiateAuthorization();
            if (!authResult.IsSuccess)
            {
                _logger.LogError("Authorization initiation failed: {Error}", authResult.ErrorMessage);
                return authResult;
            }

            _logger.LogDebug("Authorization initiated successfully. SessionCode: {SessionCode}, ExecutionCode: {ExecutionCode}, TabId: {TabId}",
                MaskValue(authResult.SessionCode), MaskValue(authResult.ExecutionCode), authResult.TabId);

            // Step 2: Submit login form
            var loginResult = await SubmitLoginForm(
                username,
                password,
                additionalCi,
                authResult.SessionCode!,
                authResult.ExecutionCode!,
                authResult.TabId!,
                authResult.Cookies);

            if (!loginResult.IsSuccess)
            {
                _logger.LogError("Login form submission failed: {Error}", loginResult.ErrorMessage);
                return loginResult;
            }

            _logger.LogInformation("Login form submitted successfully");

            // Step 3: Handle the response (either token in fragment or authorization code)
            if (!string.IsNullOrEmpty(loginResult.AccessToken))
            {
                _logger.LogInformation("Access token received directly from login");
                return loginResult;
            }

            if (!string.IsNullOrEmpty(loginResult.AuthorizationCode))
            {
                _logger.LogDebug("Authorization code received, exchanging for tokens");
                return await ExchangeCodeForTokens(loginResult.AuthorizationCode, loginResult.Cookies);
            }

            // Step 4: If login was successful but no tokens, try to complete the OAuth flow
            if (loginResult.IsSuccess && !string.IsNullOrEmpty(loginResult.ErrorMessage) &&
                loginResult.ErrorMessage.Contains("session established"))
            {
                _logger.LogDebug("Attempting to complete OAuth flow manually");
                var oauthResult = await TryCompleteOAuthFlow(loginResult.Cookies);
                if (oauthResult.IsSuccess)
                {
                    return oauthResult;
                }
            }

            return loginResult.IsSuccess ? loginResult : new SriAuthenticationResult
            {
                IsSuccess = false,
                ErrorMessage = "Authentication completed but no tokens were received"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Authentication failed for user: {Username}", MaskUsername(username));
            return new SriAuthenticationResult
            {
                IsSuccess = false,
                ErrorMessage = $"Authentication error: {ex.Message}"
            };
        }
    }

    private bool ValidateIdentification(string identification)
    {
        // Remove any whitespace
        identification = identification.Trim();

        // Should be numeric and have valid length
        if (!identification.All(char.IsDigit))
        {
            return false;
        }

        // CI: 10 digits, RUC: 13 digits, Passport: varies but typically alphanumeric
        var length = identification.Length;
        return length is 10 or 13 or >= 6 and <= 20;
    }

    private string MaskValue(string? value) =>
        string.IsNullOrEmpty(value) || value.Length <= 8
            ? "***"
            : value.Substring(0, 8) + "***";

    private async Task<SriAuthenticationResult> InitiateAuthorization()
    {
        try
        {
            // Fix the redirect URI to match the browser behavior (double slash)
            var correctedRedirectUri = _options.RedirectUri.Replace("/sri-en-linea/contribuyente", "/sri-en-linea/contribuyente");

            var authUrl = $"/auth/realms/{_options.Realm}/protocol/openid-connect/auth" +
                          $"?client_id={Uri.EscapeDataString(_options.ClientId)}" +
                          $"&redirect_uri={Uri.EscapeDataString(correctedRedirectUri)}" +
                          $"&state={Guid.NewGuid()}" +
                          $"&nonce={Guid.NewGuid()}" +
                          $"&response_mode=fragment" +
                          $"&response_type=code" +
                          $"&scope=openid";

            _logger.LogDebug("Initiating authorization with URL: {AuthUrl}", authUrl);

            var request = new HttpRequestMessage(HttpMethod.Get, authUrl);
            var response = await _httpClient.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();
            var cookies = ExtractCookies(response);

            _logger.LogDebug("Authorization response status: {StatusCode}", response.StatusCode);
            _logger.LogDebug("Authorization response cookies: {Cookies}", string.Join(", ", cookies.Keys));

            var sessionCode = ExtractSessionCode(content);
            var executionCode = ExtractExecutionCode(content);
            var tabId = ExtractTabId(content);

            _logger.LogDebug("Extracted parameters - SessionCode: {SessionCode}, ExecutionCode: {ExecutionCode}, TabId: {TabId}",
                !string.IsNullOrEmpty(sessionCode) ? "Found" : "Missing",
                !string.IsNullOrEmpty(executionCode) ? "Found" : "Missing",
                !string.IsNullOrEmpty(tabId) ? tabId : "Missing");

            if (string.IsNullOrEmpty(sessionCode) || string.IsNullOrEmpty(executionCode))
            {
                _logger.LogError("Failed to extract session parameters from auth page");
                _logger.LogDebug("Auth page content: {Content}", content.Substring(0, Math.Min(1000, content.Length)));
                return new SriAuthenticationResult
                {
                    IsSuccess = false,
                    ErrorMessage = "Failed to extract required parameters from authorization page"
                };
            }

            return new SriAuthenticationResult
            {
                IsSuccess = true,
                SessionCode = sessionCode,
                ExecutionCode = executionCode,
                TabId = tabId,
                Cookies = cookies
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to initiate authorization");
            return new SriAuthenticationResult
            {
                IsSuccess = false,
                ErrorMessage = $"Failed to initiate authorization: {ex.Message}"
            };
        }
    }



    private async Task<SriAuthenticationResult> SubmitLoginForm(
        string username,
        string password,
        string? additionalCi,
        string sessionCode,
        string executionCode,
        string? tabId,
        Dictionary<string, string> cookies)
    {
        try
        {
            var loginUrl = $"/auth/realms/{_options.Realm}/login-actions/authenticate" +
                           $"?session_code={Uri.EscapeDataString(sessionCode)}" +
                           $"&execution={Uri.EscapeDataString(executionCode)}" +
                           $"&client_id={Uri.EscapeDataString(_options.ClientId)}";

            if (!string.IsNullOrEmpty(tabId))
                loginUrl += $"&tab_id={Uri.EscapeDataString(tabId)}";

            var formData = new Dictionary<string, string>
            {
                ["username"] = username,
                ["usuario"] = username,
                ["password"] = password,
                ["login"] = "Ingresar"
            };
            if (!string.IsNullOrEmpty(additionalCi))
                formData["ciAdicional"] = additionalCi;

            _logger.LogDebug("Submitting login form: {FormData}", JsonSerializer.Serialize(formData));

            var handler = new HttpClientHandler { AllowAutoRedirect = false };
            using var tempClient = new HttpClient(handler)
            {
                BaseAddress = _httpClient.BaseAddress,
                Timeout = _httpClient.Timeout
            };

            foreach (var header in _httpClient.DefaultRequestHeaders)
            {
                if (!tempClient.DefaultRequestHeaders.Contains(header.Key))
                    tempClient.DefaultRequestHeaders.Add(header.Key, header.Value);
            }

            var request = new HttpRequestMessage(HttpMethod.Post, loginUrl)
            {
                Content = new FormUrlEncodedContent(formData)
            };
            AddCookiesToRequest(request, cookies);
            request.Headers.Referrer = new Uri(_httpClient.BaseAddress, $"/auth/realms/{_options.Realm}/protocol/openid-connect/auth");

            var response = await tempClient.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();
            MergeCookies(cookies, ExtractCookies(response));

            _logger.LogDebug("Login response content length: {Length}", content.Length);

            // 1️⃣ Token directly in redirect fragment
            if (response.StatusCode is HttpStatusCode.Redirect or HttpStatusCode.Found)
            {
                var location = response.Headers.Location?.ToString();
                _logger.LogDebug("Redirect after login: {Location}", location ?? "NULL");

                if (!string.IsNullOrEmpty(location))
                {
                    var tokenResult = TryParseTokenFromLocation(location, cookies);
                    if (tokenResult != null) return tokenResult;

                    if (!location.StartsWith("http"))
                        location = new Uri(_httpClient.BaseAddress, location).ToString();

                    var followResult = await FollowRedirect(location, cookies);
                    if (followResult.IsSuccess) return followResult;
                }
            }

            // 2️⃣ Handle "CI adicional" step
            if (content.Contains("name=\"ciAdicional\""))
            {
                _logger.LogInformation("Additional CI requested. Submitting CI...");

                if (string.IsNullOrEmpty(additionalCi))
                {
                    return new SriAuthenticationResult
                    {
                        IsSuccess = false,
                        ErrorMessage = "Additional CI required but not provided",
                        Cookies = cookies
                    };
                }

                var ciForm = new Dictionary<string, string>
                {
                    ["ciAdicional"] = additionalCi,
                    ["login"] = "Ingresar"
                };

                var ciRequest = new HttpRequestMessage(HttpMethod.Post, loginUrl)
                {
                    Content = new FormUrlEncodedContent(ciForm)
                };
                AddCookiesToRequest(ciRequest, cookies);

                var ciResponse = await tempClient.SendAsync(ciRequest);
                var ciContent = await ciResponse.Content.ReadAsStringAsync();
                MergeCookies(cookies, ExtractCookies(ciResponse));

                if (ciResponse.StatusCode == HttpStatusCode.Redirect)
                {
                    var location = ciResponse.Headers.Location?.ToString();
                    var tokenResult = TryParseTokenFromLocation(location, cookies);
                    if (tokenResult != null) return tokenResult;
                    if (!string.IsNullOrEmpty(location))
                        return await FollowRedirect(location, cookies);
                }

                if (IsAuthenticated(ciContent))
                    return new SriAuthenticationResult { IsSuccess = true, Cookies = cookies };
            }

            // 3️⃣ Common login errors
            if (content.Contains("Usuario o clave incorrectos") ||
                content.Contains("Invalid username or password") ||
                content.Contains("credenciales incorrectas") ||
                content.Contains("login-error"))
            {
                return new SriAuthenticationResult
                {
                    IsSuccess = false,
                    ErrorMessage = "Invalid credentials or authentication failed",
                    Cookies = cookies
                };
            }

            // 4️⃣ Detect success by content indicators
            if (IsAuthenticated(content))
            {
                return new SriAuthenticationResult
                {
                    IsSuccess = true,
                    Cookies = cookies
                };
            }

            // 5️⃣ Session established but unclear result → check protected page
            if (cookies.ContainsKey("AUTH_SESSION_ID"))
            {
                _logger.LogDebug("Session cookie found, validating with protected page...");

                var profileReq = new HttpRequestMessage(HttpMethod.Get, "/sri-en-linea/contribuyente/perfil");
                AddCookiesToRequest(profileReq, cookies);
                var profileResp = await tempClient.SendAsync(profileReq);
                var profileContent = await profileResp.Content.ReadAsStringAsync();

                if (IsAuthenticated(profileContent))
                    return new SriAuthenticationResult { IsSuccess = true, Cookies = cookies };
            }

            // 6️⃣ Fallback failure
            return new SriAuthenticationResult
            {
                IsSuccess = false,
                ErrorMessage = "Unclear authentication result",
                Cookies = cookies
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Login form submission failed");
            return new SriAuthenticationResult
            {
                IsSuccess = false,
                ErrorMessage = $"Login form submission failed: {ex.Message}"
            };
        }
    }



    private async Task<SriAuthenticationResult> FollowRedirect(string redirectUrl, Dictionary<string, string> cookies)
    {
        try
        {
            _logger.LogDebug("Following redirect: {RedirectUrl}", redirectUrl);

            var request = new HttpRequestMessage(HttpMethod.Get, redirectUrl);
            AddCookiesToRequest(request, cookies);

            // Don't follow redirects automatically
            var handler = new HttpClientHandler { AllowAutoRedirect = false };
            using var tempClient = new HttpClient(handler);

            // Copy configuration from main client
            tempClient.BaseAddress = _httpClient.BaseAddress;
            tempClient.Timeout = _httpClient.Timeout;

            foreach (var header in _httpClient.DefaultRequestHeaders)
            {
                if (!tempClient.DefaultRequestHeaders.Contains(header.Key))
                {
                    tempClient.DefaultRequestHeaders.Add(header.Key, header.Value);
                }
            }

            var response = await tempClient.SendAsync(request);
            var newCookies = ExtractCookies(response);

            // Merge cookies
            foreach (var cookie in newCookies)
            {
                cookies[cookie.Key] = cookie.Value;
            }

            _logger.LogDebug("Redirect response status: {StatusCode}", response.StatusCode);

            // Check for another redirect with tokens
            if (response.StatusCode is HttpStatusCode.Redirect or HttpStatusCode.Found)
            {
                var location = response.Headers.Location?.ToString();
                if (!string.IsNullOrEmpty(location))
                {
                    _logger.LogDebug("Another redirect detected: {Location}", location);

                    // Check for fragment with tokens
                    if (location.Contains("#"))
                    {
                        var fragment = location.Split('#')[1];
                        _logger.LogDebug("Found fragment in redirect chain: {Fragment}", fragment);
                        var tokenResult = ParseTokenResponse(fragment);
                        tokenResult.Cookies = cookies;
                        return tokenResult;
                    }

                    // Check for authorization code
                    if (location.Contains("code="))
                    {
                        var uri = new Uri(location, UriKind.RelativeOrAbsolute);
                        if (!uri.IsAbsoluteUri)
                        {
                            uri = new Uri(_httpClient.BaseAddress, location);
                        }

                        var query = HttpUtility.ParseQueryString(uri.Query);
                        var code = query["code"];
                        if (!string.IsNullOrEmpty(code))
                        {
                            _logger.LogDebug("Found authorization code in redirect chain: {CodeFound}", !string.IsNullOrEmpty(code));
                            return new SriAuthenticationResult
                            {
                                IsSuccess = true,
                                AuthorizationCode = code,
                                Cookies = cookies
                            };
                        }
                    }
                }
            }

            // Check response content
            var content = await response.Content.ReadAsStringAsync();
            _logger.LogDebug("Redirect response content preview: {Content}",
                content.Substring(0, Math.Min(500, content.Length)));

            // Check for success indicators in the redirected page
            var successIndicators = new[]
            {
                "perfil",
                "dashboard",
                "contribuyente",
                "logout",
                "sri-en-linea",
                "welcome",
                "bienvenido"
            };

            var hasSuccessIndicators = successIndicators.Any(indicator =>
                content.Contains(indicator, StringComparison.OrdinalIgnoreCase));

            return hasSuccessIndicators && !content.Contains("kc-form-login")
                ? new SriAuthenticationResult
                {
                    IsSuccess = true,
                    Cookies = cookies
                }
                : new SriAuthenticationResult
                {
                    IsSuccess = false,
                    ErrorMessage = "Redirect followed but no tokens or success indicators found",
                    Cookies = cookies
                };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error following redirect");
            return new SriAuthenticationResult
            {
                IsSuccess = false,
                ErrorMessage = $"Error following redirect: {ex.Message}"
            };
        }
    }

    private async Task<SriAuthenticationResult> TryCompleteOAuthFlow(Dictionary<string, string> cookies)
    {
        try
        {
            // Try to access the OAuth authorization endpoint to complete the flow
            var authUrl = $"/auth/realms/{_options.Realm}/protocol/openid-connect/auth" +
                          $"?client_id={Uri.EscapeDataString(_options.ClientId)}" +
                          $"&redirect_uri={Uri.EscapeDataString(_options.RedirectUri)}" +
                          $"&response_type=code" +
                          $"&scope=openid" +
                          $"&state={Guid.NewGuid():N}" +
                          $"&nonce={Guid.NewGuid():N}";

            var request = new HttpRequestMessage(HttpMethod.Get, authUrl);
            AddCookiesToRequest(request, cookies);

            // Don't follow redirects automatically
            var handler = new HttpClientHandler { AllowAutoRedirect = false };
            using var tempClient = new HttpClient(handler);
            tempClient.BaseAddress = _httpClient.BaseAddress;
            tempClient.Timeout = _httpClient.Timeout;

            foreach (var header in _httpClient.DefaultRequestHeaders)
            {
                if (!tempClient.DefaultRequestHeaders.Contains(header.Key))
                {
                    tempClient.DefaultRequestHeaders.Add(header.Key, header.Value);
                }
            }

            var response = await tempClient.SendAsync(request);

            if (response.StatusCode is HttpStatusCode.Redirect or HttpStatusCode.Found)
            {
                var location = response.Headers.Location?.ToString();
                if (!string.IsNullOrEmpty(location))
                {
                    _logger.LogDebug("OAuth completion redirect: {Location}", location);

                    // Check for authorization code in redirect
                    if (location.Contains("code="))
                    {
                        var uri = new Uri(location, UriKind.RelativeOrAbsolute);
                        if (!uri.IsAbsoluteUri)
                        {
                            uri = new Uri(_httpClient.BaseAddress, location);
                        }

                        var query = HttpUtility.ParseQueryString(uri.Query);
                        var code = query["code"];
                        if (!string.IsNullOrEmpty(code))
                        {
                            return await ExchangeCodeForTokens(code, cookies);
                        }
                    }

                    // Check for tokens in fragment
                    if (location.Contains("#"))
                    {
                        var fragment = location.Split('#')[1];
                        var tokenResult = ParseTokenResponse(fragment);
                        tokenResult.Cookies = cookies;
                        return tokenResult;
                    }
                }
            }

            return new SriAuthenticationResult
            {
                IsSuccess = false,
                ErrorMessage = "Could not complete OAuth flow"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to complete OAuth flow");
            return new SriAuthenticationResult
            {
                IsSuccess = false,
                ErrorMessage = $"OAuth flow completion failed: {ex.Message}"
            };
        }
    }

    private async Task<SriAuthenticationResult> ExchangeCodeForTokens(string code, Dictionary<string, string> cookies)
    {
        try
        {
            var tokenUrl = $"/auth/realms/{_options.Realm}/protocol/openid-connect/token";

            var formData = new Dictionary<string, string>
            {
                ["grant_type"] = "authorization_code",
                ["code"] = code,
                ["redirect_uri"] = _options.RedirectUri,
                ["client_id"] = _options.ClientId
            };

            var request = new HttpRequestMessage(HttpMethod.Post, tokenUrl)
            {
                Content = new FormUrlEncodedContent(formData)
            };
            AddCookiesToRequest(request, cookies);

            var response = await _httpClient.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Token exchange failed: {StatusCode} - {Content}",
                    response.StatusCode, content);
                return new SriAuthenticationResult
                {
                    IsSuccess = false,
                    ErrorMessage = $"Token exchange failed: {response.StatusCode}"
                };
            }

            using var doc = JsonDocument.Parse(content);
            var root = doc.RootElement;

            return new SriAuthenticationResult
            {
                IsSuccess = true,
                AccessToken = root.TryGetProperty("access_token", out var accessToken) ? accessToken.GetString() : null,
                RefreshToken = root.TryGetProperty("refresh_token", out var refreshToken) ? refreshToken.GetString() : null,
                ExpiresIn = root.TryGetProperty("expires_in", out var expiresIn) ? expiresIn.GetInt32() : 0,
                Cookies = cookies
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Token exchange failed");
            return new SriAuthenticationResult
            {
                IsSuccess = false,
                ErrorMessage = $"Token exchange failed: {ex.Message}"
            };
        }
    }

    private SriAuthenticationResult ParseTokenResponse(string fragment)
    {
        var parameters = HttpUtility.ParseQueryString(fragment);
        return new SriAuthenticationResult
        {
            IsSuccess = true,
            AccessToken = parameters["access_token"],
            RefreshToken = parameters["refresh_token"],
            ExpiresIn = int.TryParse(parameters["expires_in"], out var expires) ? expires : 0
        };
    }

    private Dictionary<string, string> ExtractCookies(HttpResponseMessage response)
    {
        var cookies = new Dictionary<string, string>();

        if (response.Headers.TryGetValues("Set-Cookie", out var cookieValues))
        {
            foreach (var cookie in cookieValues)
            {
                var parts = cookie.Split(';')[0].Split('=');
                if (parts.Length == 2)
                {
                    cookies[parts[0]] = parts[1];
                }
            }
        }

        return cookies;
    }

    private void AddCookiesToRequest(HttpRequestMessage request, Dictionary<string, string> cookies)
    {
        if (cookies.Any())
        {
            var cookieHeader = string.Join("; ", cookies.Select(c => $"{c.Key}={c.Value}"));
            request.Headers.Add("Cookie", cookieHeader);
        }
    }

    private string ExtractSessionCode(string content)
    {
        // Try to extract from form action
        var match = Regex.Match(content, @"action=""[^""]*[?&]session_code=([^&""'>\s]+)", RegexOptions.IgnoreCase);
        if (match.Success) return match.Groups[1].Value;

        // Try to extract from hidden input
        match = Regex.Match(content, @"<input[^>]*name=""session_code""[^>]*value=""([^""]+)""", RegexOptions.IgnoreCase);
        return match.Success ? match.Groups[1].Value : string.Empty;
    }

    private string ExtractExecutionCode(string content)
    {
        try
        {
            // Extract from form action URL
            var actionMatch = Regex.Match(content,
                @"action=""[^""]*[?&]execution=([a-f0-9-]{36})",
                RegexOptions.IgnoreCase);

            if (actionMatch.Success)
            {
                return actionMatch.Groups[1].Value;
            }

            // Alternative pattern
            actionMatch = Regex.Match(content,
                @"execution=([a-f0-9-]{36})",
                RegexOptions.IgnoreCase);

            if (actionMatch.Success)
            {
                return actionMatch.Groups[1].Value;
            }

            // Check for hidden input field
            var hiddenMatch = Regex.Match(content,
                @"<input[^>]*name=""execution""[^>]*value=""([a-f0-9-]{36})""",
                RegexOptions.IgnoreCase);

            return hiddenMatch.Success ? hiddenMatch.Groups[1].Value : string.Empty;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error extracting execution code");
            return string.Empty;
        }
    }

    private string ExtractTabId(string content)
    {
        try
        {
            // Extract tab_id from form action URL
            var match = Regex.Match(content,
                @"action=""[^""]*[?&]tab_id=([^&""'>\s]+)",
                RegexOptions.IgnoreCase);

            if (match.Success)
            {
                return match.Groups[1].Value;
            }

            // Try alternative pattern
            match = Regex.Match(content,
                @"tab_id=([^&""'>\s]+)",
                RegexOptions.IgnoreCase);

            return match.Success ? match.Groups[1].Value : string.Empty;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error extracting tab_id");
            return string.Empty;
        }
    }

    private string MaskUsername(string username) =>
        string.IsNullOrEmpty(username) || username.Length <= 4
            ? "***"
            : username.Substring(0, 4) + new string('*', username.Length - 4);

    private bool IsAuthenticated(string html)
    {
        return html.Contains("perfil") ||
               html.Contains("dashboard") ||
               html.Contains("contribuyente") ||
               html.Contains("sri-en-linea") ||
               html.Contains("logout");
    }

    private bool IsLoginPageContent(string html)
    {
        if (string.IsNullOrEmpty(html))
            return true;

        return html.IndexOf("kc-form-login", StringComparison.OrdinalIgnoreCase) >= 0 ||
               html.IndexOf("login-pf", StringComparison.OrdinalIgnoreCase) >= 0 ||
               html.IndexOf("kc-button", StringComparison.OrdinalIgnoreCase) >= 0;
    }

    private void MergeCookies(Dictionary<string, string> target, Dictionary<string, string> source)
    {
        foreach (var cookie in source)
            target[cookie.Key] = cookie.Value;
    }

    private SriAuthenticationResult? TryParseTokenFromLocation(string? location, Dictionary<string, string> cookies)
    {
        if (string.IsNullOrEmpty(location)) return null;

        if (location.Contains("#"))
        {
            var fragment = location.Split('#')[1];
            var tokenResult = ParseTokenResponse(fragment);
            tokenResult.Cookies = cookies;
            return tokenResult;
        }

        if (location.Contains("code="))
        {
            var query = HttpUtility.ParseQueryString(new Uri(location).Query);
            var code = query["code"];
            if (!string.IsNullOrEmpty(code))
            {
                return new SriAuthenticationResult
                {
                    IsSuccess = true,
                    AuthorizationCode = code,
                    Cookies = cookies
                };
            }
        }
        return null;
    }

    public async Task<SriDocumentsResponse> GetReceivedDocumentsAsync(SriDocumentsRequest request)
    {
        try
        {
            _logger.LogInformation("Starting to fetch received documents for user: {Username}", MaskUsername(request.Username));

            if (request.UseBrowserAutomation)
            {
                return await GetReceivedDocumentsWithPlaywrightAsync(request);
            }

            var sessionCookies = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
            var usingProvidedCookies = request.Cookies != null && request.Cookies.Any();

            if (usingProvidedCookies)
            {
                _logger.LogInformation("Using {CookieCount} cookies provided by caller for user: {Username}", request.Cookies!.Count, MaskUsername(request.Username));
                foreach (var cookie in request.Cookies!)
                {
                    sessionCookies[cookie.Key] = cookie.Value;
                }
            }
            else
            {
                _logger.LogInformation("No cookies provided, authenticating against SRI for user: {Username}", MaskUsername(request.Username));
                var authResult = await AuthenticateAsync(request.Username, request.Password, request.AdditionalCi);
                if (!authResult.IsSuccess)
                {
                    return new SriDocumentsResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = $"Authentication failed: {authResult.ErrorMessage}"
                    };
                }

                if (authResult.Cookies == null || authResult.Cookies.Count == 0)
                {
                    _logger.LogWarning("Authentication succeeded but no cookies were returned for user: {Username}", MaskUsername(request.Username));
                    return new SriDocumentsResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Authentication did not return session cookies"
                    };
                }

                foreach (var cookie in authResult.Cookies)
                {
                    sessionCookies[cookie.Key] = cookie.Value;
                }
            }

            _logger.LogInformation(usingProvidedCookies
                ? "Using provided session cookies, preparing documents page client..."
                : "Authentication successful, preparing session client for documents page...");

            var handler = new HttpClientHandler
            {
                AllowAutoRedirect = true,
                UseCookies = true,
                CookieContainer = new System.Net.CookieContainer()
            };

            var sriBaseUri = new Uri("https://srienlinea.sri.gob.ec");
            foreach (var cookie in sessionCookies)
            {
                try
                {
                    handler.CookieContainer.Add(sriBaseUri, new System.Net.Cookie(cookie.Key, cookie.Value));
                }
                catch (Exception cookieEx)
                {
                    _logger.LogDebug(cookieEx, "Failed to attach cookie {CookieName}", cookie.Key);
                }
            }

            using var sessionClient = new HttpClient(handler, disposeHandler: true);
            sessionClient.Timeout = _httpClient.Timeout;
            sessionClient.DefaultRequestHeaders.UserAgent.ParseAdd("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
            sessionClient.DefaultRequestHeaders.Accept.Clear();
            sessionClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("text/html"));
            sessionClient.DefaultRequestHeaders.TryAddWithoutValidation("Accept-Language", "es-EC,es;q=0.9,en;q=0.8");

            // Step 2: Navigate to comprobantes electronicos page
            var documentsPageUrl = "https://srienlinea.sri.gob.ec/comprobantes-electronicos-internet/pages/consultas/recibidos/comprobantesRecibidos.jsf?&contextoMPT=https://srienlinea.sri.gob.ec/tuportal-internet&pathMPT=Facturaci%F3n%20Electr%F3nica&actualMPT=Comprobantes%20electr%F3nicos%20recibidos%20&linkMPT=%2Fcomprobantes-electronicos-internet%2Fpages%2Fconsultas%2Frecibidos%2FcomprobantesRecibidos.jsf%3F&esFavorito=S";
            var initialResponse = await sessionClient.GetAsync(documentsPageUrl);
            var pageHtml = await initialResponse.Content.ReadAsStringAsync();

            if (IsLoginPageContent(pageHtml))
            {
                _logger.LogWarning("Documents page redirected to login for user: {Username}", MaskUsername(request.Username));
                return new SriDocumentsResponse
                {
                    IsSuccess = false,
                    ErrorMessage = "Session expired or invalid when loading documents page"
                };
            }

            var viewState = ExtractViewState(pageHtml);
            if (string.IsNullOrEmpty(viewState))
            {
                return new SriDocumentsResponse
                {
                    IsSuccess = false,
                    ErrorMessage = "Failed to extract ViewState from page"
                };
            }

            _logger.LogInformation("Page loaded successfully, ViewState extracted");

            var formData = BuildJsfAjaxFormData(request, viewState);
            using var queryRequest = new HttpRequestMessage(HttpMethod.Post, documentsPageUrl)
            {
                Content = new FormUrlEncodedContent(formData)
            };

            queryRequest.Headers.Add("Accept", "application/xml, text/xml, */*; q=0.01");
            queryRequest.Headers.Add("X-Requested-With", "XMLHttpRequest");
            queryRequest.Headers.Add("Faces-Request", "partial/ajax");
            queryRequest.Headers.Add("Referer", documentsPageUrl);

            var queryResponse = await sessionClient.SendAsync(queryRequest);
            var responseXml = await queryResponse.Content.ReadAsStringAsync();

            _logger.LogInformation("Query submitted, parsing response...");

            var documents = ParseJsfPartialResponse(responseXml);

            return new SriDocumentsResponse
            {
                IsSuccess = true,
                Documents = documents,
                TotalDocuments = documents.Count
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching received documents");
            return new SriDocumentsResponse
            {
                IsSuccess = false,
                ErrorMessage = $"Error: {ex.Message}"
            };
        }
    }

    private async Task<SriDocumentsResponse> GetReceivedDocumentsWithPlaywrightAsync(SriDocumentsRequest request)
    {
        string? capturedRecaptchaSiteKey = null;
        string? capturedRecaptchaToken = null;

        try
        {
            _logger.LogInformation("Using Playwright browser automation for user: {Username}", MaskUsername(request.Username));

            using var playwright = await Playwright.CreateAsync();

            await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
            {
                Headless = request.BrowserAutomationHeadless,
                Args = new[]
                {
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-gpu"
                }
            });

            var context = await browser.NewContextAsync(new BrowserNewContextOptions
            {
                UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                Locale = "es-EC"
            });

            IPage page = await context.NewPageAsync();
            page.SetDefaultTimeout(request.BrowserAutomationTimeoutSeconds * 1000);

            var authUrl = $"{_options.BaseUrl}/auth/realms/{_options.Realm}/protocol/openid-connect/auth" +
                         $"?client_id={Uri.EscapeDataString(_options.ClientId)}" +
                         $"&redirect_uri={Uri.EscapeDataString(_options.RedirectUri.Replace("/sri-en-linea/contribuyente", "/sri-en-linea//contribuyente"))}" +
                         $"&state={Guid.NewGuid()}" +
                         $"&nonce={Guid.NewGuid()}" +
                         $"&response_mode=fragment" +
                         $"&response_type=code" +
                         $"&scope=openid";

            await page.GotoAsync(authUrl, new PageGotoOptions { WaitUntil = WaitUntilState.NetworkIdle });

            static async Task<ILocator> FindFirstVisibleEditableAsync(IPage p, params string[] selectors)
            {
                foreach (var selector in selectors)
                {
                    var locator = p.Locator(selector);
                    var count = await locator.CountAsync();
                    for (var i = 0; i < count; i++)
                    {
                        var candidate = locator.Nth(i);
                        if (await candidate.IsVisibleAsync() && await candidate.IsEditableAsync())
                        {
                            return candidate;
                        }
                    }
                }

                throw new PlaywrightException($"No visible/editable element found. Selectors: {string.Join(", ", selectors)}");
            }

            var usernameInput = await FindFirstVisibleEditableAsync(
                page,
                "input#usuario:not([type='hidden'])",
                "input[name='usuario']:not([type='hidden'])",
                "input#username:not([type='hidden'])",
                "input[name='username']:not([type='hidden'])");

            await usernameInput.FillAsync(request.Username);

            var passwordInput = await FindFirstVisibleEditableAsync(
                page,
                "input#password:not([type='hidden'])",
                "input[name='password']:not([type='hidden'])");

            await passwordInput.FillAsync(request.Password);

            var loginButton = page.Locator("#kc-login, input[name='login'], button[name='login']");
            await loginButton.First.ClickAsync();

            await page.WaitForLoadStateAsync(LoadState.NetworkIdle);

            // Wait until we are out of Keycloak and back on SRI
            try
            {
                await page.WaitForURLAsync(
                    "**srienlinea.sri.gob.ec/**",
                    new PageWaitForURLOptions { Timeout = request.BrowserAutomationTimeoutSeconds * 1000 });
            }
            catch
            {
                // Best-effort: if SRI changes redirects, we'll continue and rely on content checks below.
            }

            // Optional CI adicional step
            var ciLocator = page.Locator("input[name='ciAdicional'], #ciAdicional");
            if (await ciLocator.CountAsync() > 0)
            {
                if (string.IsNullOrEmpty(request.AdditionalCi))
                {
                    return new SriDocumentsResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "AdditionalCi required by SRI login but not provided"
                    };
                }

                await ciLocator.First.FillAsync(request.AdditionalCi);
                await loginButton.First.ClickAsync();
                await page.WaitForLoadStateAsync(LoadState.NetworkIdle);
            }

            // After login, SRI redirects to a profile/dashboard page. Give it time to complete.
            _logger.LogInformation("Login completed. Current URL: {Url}", page.Url);

            // Wait a bit for any post-login redirects to settle
            try
            {
                await page.WaitForLoadStateAsync(LoadState.NetworkIdle, new PageWaitForLoadStateOptions { Timeout = 10_000 });
            }
            catch
            {
                // Continue even if NetworkIdle times out
            }

            _logger.LogInformation("Post-login page settled at: {Url}", page.Url);

            // Navigate to documents page with menu click -> fallback direct with context params
            var portalPrimerUrl = "https://srienlinea.sri.gob.ec/tuportal-internet/";
            var documentsPageUrl = "https://srienlinea.sri.gob.ec/comprobantes-electronicos-internet/pages/consultas/recibidos/comprobantesRecibidos.jsf?&contextoMPT=https://srienlinea.sri.gob.ec/tuportal-internet&pathMPT=Facturaci%F3n%20Electr%F3nica&actualMPT=Comprobantes%20electr%F3nicos%20recibidos%20&linkMPT=%2Fcomprobantes-electronicos-internet%2Fpages%2Fconsultas%2Frecibidos%2FcomprobantesRecibidos.jsf%3F&esFavorito=S";

            static bool IsRecibidosUrl(string? url)
            {
                return !string.IsNullOrWhiteSpace(url) && url.Contains("comprobantesRecibidos.jsf", StringComparison.OrdinalIgnoreCase);
            }

            async Task<bool> TryNavigateToRecibidosAsync()
            {
                // After login, we're on the portal home; try sidebar menu directly
                try
                {
                    // Wait for page to stabilize
                    await page.WaitForTimeoutAsync(2000);

                    // Look for menu toggle (hamburger or similar)
                    var menuToggle = page.Locator("button[aria-label*='Menú' i], button[title*='Menú' i], button[aria-label*='menu' i], .sri-menu-button, button.hamburger, .menu-toggle");
                    if (await menuToggle.CountAsync() > 0 && await menuToggle.First.IsVisibleAsync())
                    {
                        await menuToggle.First.ClickAsync(new LocatorClickOptions { Timeout = 5_000 });
                        await page.WaitForTimeoutAsync(500);
                    }

                    // Click "Facturación Electrónica" (may be in a dropdown or submenu)
                    var facturacion = page.GetByText("Facturación Electrónica", new PageGetByTextOptions { Exact = false });
                    if (await facturacion.CountAsync() > 0)
                    {
                        await facturacion.First.ClickAsync(new LocatorClickOptions { Timeout = 8_000 });
                        await page.WaitForTimeoutAsync(500);
                    }

                    // Click "Comprobantes electrónicos recibidos"
                    var recibidos = page.GetByText("Comprobantes electrónicos recibidos", new PageGetByTextOptions { Exact = false });
                    if (await recibidos.CountAsync() > 0)
                    {
                        await recibidos.First.ClickAsync(new LocatorClickOptions { Timeout = 8_000 });
                        await page.WaitForLoadStateAsync(LoadState.DOMContentLoaded, new PageWaitForLoadStateOptions { Timeout = 15_000 });
                        await page.WaitForTimeoutAsync(1000);
                        if (IsRecibidosUrl(page.Url))
                        {
                            _logger.LogInformation("Reached recibidos via menu. Url: {Url}", page.Url);
                            return true;
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Sidebar navigation failed, will try direct URL");
                }

                // Fallback: direct URL with context params
                _logger.LogInformation("Redirecting directly to documents page: {Url}", documentsPageUrl);
                await page.GotoAsync(documentsPageUrl, new PageGotoOptions
                {
                    WaitUntil = WaitUntilState.DOMContentLoaded,
                    Timeout = 30_000
                });

                await page.WaitForTimeoutAsync(2000);
                _logger.LogInformation("After direct redirect, current URL: {Url}", page.Url);

                return IsRecibidosUrl(page.Url);
            }

            var navigated = await TryNavigateToRecibidosAsync();
            if (!navigated)
            {
                return new SriDocumentsResponse
                {
                    IsSuccess = false,
                    ErrorMessage = $"Could not navigate to 'Comprobantes electrónicos recibidos'. CurrentUrl: {page.Url}",
                    RecaptchaSiteKey = request.CaptureRecaptchaValues ? capturedRecaptchaSiteKey : null,
                    RecaptchaToken = request.CaptureRecaptchaValues ? capturedRecaptchaToken : null
                };
            }

            static async Task<string?> TryGetRecaptchaSiteKeyAsync(IPage p)
            {
                var siteKeyLocator = p.Locator("[data-sitekey]");
                if (await siteKeyLocator.CountAsync() > 0)
                {
                    var siteKey = await siteKeyLocator.First.GetAttributeAsync("data-sitekey");
                    if (!string.IsNullOrWhiteSpace(siteKey))
                    {
                        return siteKey;
                    }
                }

                var html = await p.ContentAsync();
                var match = System.Text.RegularExpressions.Regex.Match(html, "data-sitekey=\"(?<k>[^\"]+)\"");
                return match.Success ? match.Groups["k"].Value : null;
            }

            static async Task<string?> TryGetRecaptchaTokenAsync(IPage p)
            {
                return await p.EvaluateAsync<string?>("() => document.getElementById('g-recaptcha-response')?.value || null");
            }

            static async Task WaitForRecaptchaSolvedAsync(IPage p, int timeoutMs)
            {
                await p.WaitForFunctionAsync(
                    "() => { const el = document.getElementById('g-recaptcha-response'); return !!(el && el.value && el.value.length > 0); }",
                    null,
                    new PageWaitForFunctionOptions { Timeout = timeoutMs });
            }

            // If still on login page, we likely hit reCAPTCHA/anti-bot.
            var html = await page.ContentAsync();
            if (IsLoginPageContent(html))
            {
                capturedRecaptchaSiteKey = await TryGetRecaptchaSiteKeyAsync(page);
                capturedRecaptchaToken = await TryGetRecaptchaTokenAsync(page);

                return new SriDocumentsResponse
                {
                    IsSuccess = false,
                    ErrorMessage = request.BrowserAutomationHeadless
                        ? "Playwright reached login page (likely reCAPTCHA/anti-bot). Try BrowserAutomationHeadless=false and solve reCAPTCHA manually."
                        : "Playwright still on login page. Solve reCAPTCHA in the opened browser, then retry."
                    ,
                    RecaptchaSiteKey = request.CaptureRecaptchaValues ? capturedRecaptchaSiteKey : null,
                    RecaptchaToken = request.CaptureRecaptchaValues ? capturedRecaptchaToken : null
                };
            }

            static string GetSpanishMonthName(int month)
            {
                return month switch
                {
                    1 => "Enero",
                    2 => "Febrero",
                    3 => "Marzo",
                    4 => "Abril",
                    5 => "Mayo",
                    6 => "Junio",
                    7 => "Julio",
                    8 => "Agosto",
                    9 => "Septiembre",
                    10 => "Octubre",
                    11 => "Noviembre",
                    12 => "Diciembre",
                    _ => month.ToString()
                };
            }

            static string GetDocumentTypeLabel(SriDocumentType t)
            {
                return t switch
                {
                    SriDocumentType.Invoice => "Factura",
                    SriDocumentType.PurchaseSettlement => "Liquidación de compra",
                    SriDocumentType.CreditNote => "Nota de Crédito",
                    SriDocumentType.DebitNote => "Nota de Débito",
                    SriDocumentType.WithholdingReceipt => "Comprobante de Retención",
                    _ => ((int)t).ToString()
                };
            }

            static async Task SelectOptionWithFallbackAsync(IPage p, string selector, string value, string? labelFallback)
            {
                try
                {
                    await p.SelectOptionAsync(selector, new[] { value });
                }
                catch
                {
                    if (string.IsNullOrWhiteSpace(labelFallback))
                    {
                        throw;
                    }

                    await p.SelectOptionAsync(selector, new[] { new SelectOptionValue { Label = labelFallback } });
                }
            }

            static async Task WaitForAnySelectorAsync(IPage p, params string[] selectors)
            {
                foreach (var selector in selectors)
                {
                    try
                    {
                        await p.WaitForSelectorAsync(selector, new PageWaitForSelectorOptions { State = WaitForSelectorState.Attached, Timeout = 15_000 });
                        return;
                    }
                    catch
                    {
                        // try next
                    }
                }

                throw new PlaywrightException($"None of the selectors appeared: {string.Join(" | ", selectors)}");
            }

            static async Task WaitForSelectOptionAsync(IPage p, string selector, string value, string? label, int timeoutMs)
            {
                var safeSelector = selector.Replace("\\", "\\\\").Replace("\"", "\\\"");
                var safeValue = value.Replace("\\", "\\\\").Replace("\"", "\\\"");
                var safeLabel = (label ?? string.Empty).Replace("\\", "\\\\").Replace("\"", "\\\"");

                await p.WaitForFunctionAsync(
                  $"() => {{ const el = document.querySelector(\"{safeSelector}\"); if (!el) return false; const opts = Array.from(el.options || []); return opts.some(o => o.value === \"{safeValue}\" || (\"{safeLabel}\" && (o.label === \"{safeLabel}\" || o.text === \"{safeLabel}\"))); }}",
                  null,
                  new PageWaitForFunctionOptions { Timeout = timeoutMs });
            }

            // Try to set dropdowns and submit the JSF form by clicking the consult button.
            // SRI may load these selects slowly and repopulate dependent selects (month -> day) via JSF/AJAX.
            // Wait explicitly so selection doesn't silently fail.
            _logger.LogInformation("Waiting for form dropdown selectors to load...");
            await WaitForAnySelectorAsync(page, "select[name='frmPrincipal:ano']", "#frmPrincipal\\:ano");
            await WaitForAnySelectorAsync(page, "select[name='frmPrincipal:mes']", "#frmPrincipal\\:mes");
            await WaitForAnySelectorAsync(page, "select[name='frmPrincipal:dia']", "#frmPrincipal\\:dia");
            await WaitForAnySelectorAsync(page, "select[name='frmPrincipal:cmbTipoComprobante']", "#frmPrincipal\\:cmbTipoComprobante");
            _logger.LogInformation("Form selectors found. Selecting values...");

            await SelectOptionWithFallbackAsync(
                page,
                "select[name='frmPrincipal:ano'], #frmPrincipal\\:ano",
                request.Year.ToString(),
                request.Year.ToString());
            _logger.LogInformation("Selected year: {Year}", request.Year);

            await SelectOptionWithFallbackAsync(
                page,
                "select[name='frmPrincipal:mes'], #frmPrincipal\\:mes",
                request.Month.ToString(),
                GetSpanishMonthName(request.Month));
            _logger.LogInformation("Selected month: {Month} ({MonthName})", request.Month, GetSpanishMonthName(request.Month));

            // Day options are often repopulated after selecting the month; wait until the expected option exists.
            var desiredDayValue = request.Day.ToString();
            var desiredDayLabel = request.Day == 0 ? "Todos" : request.Day.ToString();
            _logger.LogInformation("Waiting for day option to appear: value={DayValue}, label={DayLabel}", desiredDayValue, desiredDayLabel);
            await WaitForSelectOptionAsync(
              page,
              "select[name='frmPrincipal:dia']",
              desiredDayValue,
              desiredDayLabel,
              Math.Min(30_000, request.BrowserAutomationTimeoutSeconds * 1000));

            await SelectOptionWithFallbackAsync(
                page,
                "select[name='frmPrincipal:dia'], #frmPrincipal\\:dia",
                desiredDayValue,
                desiredDayLabel);
            _logger.LogInformation("Selected day: {Day} ({DayLabel})", request.Day, desiredDayLabel);

            await SelectOptionWithFallbackAsync(
                page,
                "select[name='frmPrincipal:cmbTipoComprobante'], #frmPrincipal\\:cmbTipoComprobante",
                ((int)request.DocumentType).ToString(),
                GetDocumentTypeLabel(request.DocumentType));
            _logger.LogInformation("Selected document type: {DocumentType} ({DocumentTypeLabel})", request.DocumentType, GetDocumentTypeLabel(request.DocumentType));

            _logger.LogInformation("Form dropdowns loaded. Setting period: Year={Year}, Month={Month}, Day={Day}, DocumentType={DocType}",
                request.Year, request.Month, request.Day, request.DocumentType);

            // Ensure RUC option selected
            var rucRadio = page.Locator("input[name='frmPrincipal:opciones'][value='ruc'], #frmPrincipal\\:opciones\\:0");
            if (await rucRadio.CountAsync() > 0)
            {
                await rucRadio.First.CheckAsync(new LocatorCheckOptions { Force = true });
                _logger.LogInformation("RUC radio option selected");
            }

            // The RUC field (txtParametro) is usually pre-filled and disabled when logged in
            // Only try to fill it if it's enabled and editable
            try
            {
                var rucInput = await FindFirstVisibleEditableAsync(
                    page,
                    "input[name='frmPrincipal:txtParametro']",
                    "input#frmPrincipal\\:txtParametro",
                    "input[name='frmPrincipal:txtRuc']",
                    "input#frmPrincipal\\:txtRuc",
                    "input[id*='txtParametro']",
                    "input[id*='txtRuc']");

                var currentValue = await rucInput.InputValueAsync();
                _logger.LogInformation("RUC field current value: {Value}", currentValue);

                if (string.IsNullOrWhiteSpace(currentValue) || !currentValue.Trim().Equals(request.Username, StringComparison.OrdinalIgnoreCase))
                {
                    await rucInput.FillAsync(request.Username);
                    _logger.LogInformation("Filled RUC field with: {RUC}", request.Username);
                }
            }
            catch (Exception ex)
            {
                // Field is disabled or not found - this is normal when logged in
                _logger.LogDebug(ex, "Could not fill RUC field (likely disabled/pre-filled). Continuing...");
            }

            // If caller provided a recaptcha token, inject it
            if (!string.IsNullOrEmpty(request.RecaptchaToken))
            {
                await page.EvaluateAsync("(token) => { const el = document.getElementById('g-recaptcha-response'); if (el) el.value = token; }", request.RecaptchaToken);
            }

            // If reCAPTCHA is present and token wasn't provided, require manual solve (headful) or fail (headless)
            var pageSiteKey = await TryGetRecaptchaSiteKeyAsync(page);
            capturedRecaptchaSiteKey = pageSiteKey;
            var recaptchaAutoSolved = false;
            if (!string.IsNullOrEmpty(pageSiteKey) && string.IsNullOrEmpty(request.RecaptchaToken))
            {
                _logger.LogInformation("reCAPTCHA detected with sitekey: {SiteKey}", pageSiteKey);

                // Try automatic solver first if enabled and requested
                if (request.UseRecaptchaSolver && _recaptchaSolverOptions.Enabled && !string.IsNullOrWhiteSpace(_recaptchaSolverOptions.ApiKey))
                {
                    _logger.LogInformation("Attempting automatic reCAPTCHA solve via {Provider}", _recaptchaSolverOptions.Provider);
                    var solveResult = await _recaptchaSolver.SolveAsync(pageSiteKey, page.Url, request.BrowserAutomationTimeoutSeconds, CancellationToken.None);
                    if (solveResult.IsSuccess && !string.IsNullOrWhiteSpace(solveResult.Token))
                    {
                        recaptchaAutoSolved = true;
                        capturedRecaptchaToken = solveResult.Token;
                        await page.EvaluateAsync("(token) => { const el = document.getElementById('g-recaptcha-response'); if (el) el.value = token; }", solveResult.Token);
                        _logger.LogInformation("Automatic reCAPTCHA solver succeeded via {Provider}", _recaptchaSolverOptions.Provider);
                    }
                    else
                    {
                        _logger.LogWarning("Automatic reCAPTCHA solver failed: {Error}", solveResult.Error ?? "Unknown error");
                    }
                }

                if (recaptchaAutoSolved)
                {
                    // Skip manual handling since token injected
                }
                else if (request.BrowserAutomationHeadless)
                {
                    return new SriDocumentsResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "reCAPTCHA is required by SRI and cannot be solved in headless mode. Use BrowserAutomationHeadless=false (manual solve) or provide a RecaptchaToken.",
                        RecaptchaSiteKey = request.CaptureRecaptchaValues ? pageSiteKey : null
                    };
                }
                else
                {
                    _logger.LogInformation("reCAPTCHA detected. Waiting for manual solve (timeout: {Timeout}s)...", request.BrowserAutomationTimeoutSeconds);
                    try
                    {
                        await WaitForRecaptchaSolvedAsync(page, request.BrowserAutomationTimeoutSeconds * 1000);
                        capturedRecaptchaToken = await TryGetRecaptchaTokenAsync(page);
                        _logger.LogInformation("reCAPTCHA solved successfully");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "reCAPTCHA wait timeout or error");
                        return new SriDocumentsResponse
                        {
                            IsSuccess = false,
                            ErrorMessage = $"reCAPTCHA not solved within {request.BrowserAutomationTimeoutSeconds} seconds. Solve it manually in the opened browser or provide a RecaptchaToken.",
                            RecaptchaSiteKey = request.CaptureRecaptchaValues ? pageSiteKey : null,
                            RecaptchaToken = request.CaptureRecaptchaValues ? capturedRecaptchaToken : null
                        };
                    }
                }
            }
            else if (!string.IsNullOrEmpty(pageSiteKey))
            {
                _logger.LogInformation("reCAPTCHA present but token was provided in request");
            }
            else
            {
                _logger.LogInformation("No reCAPTCHA detected on this page");
            }

            _logger.LogInformation("Looking for 'Consultar' button...");
            ILocator consultButton;
            try
            {
                consultButton = page.GetByRole(AriaRole.Button, new PageGetByRoleOptions { Name = "Consultar" });
                var buttonCount = await consultButton.CountAsync();
                _logger.LogInformation("Found {Count} 'Consultar' buttons via role", buttonCount);
                if (buttonCount == 0)
                {
                    throw new Exception("No buttons found via role");
                }
                await consultButton.First.ClickAsync();
                _logger.LogInformation("Clicked 'Consultar' button (via role)");
            }
            catch
            {
                consultButton = page.Locator("button:has-text('Consultar'), input[value='Consultar'], a:has-text('Consultar')");
                var fallbackCount = await consultButton.CountAsync();
                _logger.LogInformation("Found {Count} 'Consultar' buttons via fallback selector", fallbackCount);
                if (fallbackCount == 0)
                {
                    _logger.LogError("No 'Consultar' button found with any selector. Page HTML: {Html}", await page.ContentAsync());
                    throw new Exception("No Consultar button found");
                }
                await consultButton.First.ClickAsync();
                _logger.LogInformation("Clicked 'Consultar' button (via fallback selector)");
            }

            // If SRI triggers reCAPTCHA only on submit, allow manual solve and then continue.
            if (!request.BrowserAutomationHeadless && string.IsNullOrEmpty(request.RecaptchaToken))
            {
                try
                {
                    _logger.LogInformation("Checking for post-submit reCAPTCHA...");
                    await WaitForRecaptchaSolvedAsync(page, Math.Min(60_000, request.BrowserAutomationTimeoutSeconds * 1000));
                    capturedRecaptchaToken ??= await TryGetRecaptchaTokenAsync(page);
                    _logger.LogInformation("Post-submit reCAPTCHA solved");
                }
                catch
                {
                    // No captcha or it wasn't required on submit.
                    _logger.LogDebug("No post-submit reCAPTCHA detected");
                }
            }

            // Wait for table to render
            _logger.LogInformation("Waiting for results table to appear (timeout: {Timeout}s)...", request.BrowserAutomationTimeoutSeconds);
            var table = page.Locator(
                "#frmPrincipal\\:tablaCompRecibidos, " +
                "table[id='frmPrincipal:tablaCompRecibidos'], " +
                "table[id*='tablaCompRecib'], " +
                "table[id*='tablaComp'], " +
                "#frmPrincipal\\:panelListaComprobantes table");
            await table.WaitForAsync(new LocatorWaitForOptions { Timeout = request.BrowserAutomationTimeoutSeconds * 1000 });
            _logger.LogInformation("Results table appeared, scraping rows...");

            // Scrape rows
            var rows = table.Locator("tbody tr");
            var count = await rows.CountAsync();
            _logger.LogInformation("Found {RowCount} table rows", count);
            var documents = new List<SriDocument>();

            for (var i = 0; i < count; i++)
            {
                var row = rows.Nth(i);
                var cells = row.Locator("td");
                var cellCount = await cells.CountAsync();
                if (cellCount < 5)
                {
                    _logger.LogDebug("Row {RowIndex} has only {CellCount} cells, skipping", i, cellCount);
                    continue;
                }

                var docType = (await cells.Nth(0).InnerTextAsync()).Trim();
                var docNumber = (await cells.Nth(1).InnerTextAsync()).Trim();
                var issueDateText = (await cells.Nth(2).InnerTextAsync()).Trim();
                var issuerName = (await cells.Nth(3).InnerTextAsync()).Trim();
                var totalText = (await cells.Nth(4).InnerTextAsync()).Trim();

                documents.Add(new SriDocument
                {
                    DocumentType = docType,
                    DocumentNumber = docNumber,
                    IssueDate = ParseDate(issueDateText),
                    IssuerName = issuerName,
                    TotalAmount = ParseAmount(totalText)
                });
            }

            _logger.LogInformation("Successfully scraped {DocumentCount} documents", documents.Count);
            return new SriDocumentsResponse
            {
                IsSuccess = true,
                Documents = documents,
                TotalDocuments = documents.Count,
                RecaptchaSiteKey = request.CaptureRecaptchaValues ? pageSiteKey : null,
                RecaptchaToken = request.CaptureRecaptchaValues ? (capturedRecaptchaToken ?? await TryGetRecaptchaTokenAsync(page)) : null
            };
        }
        catch (PlaywrightException ex)
        {
            _logger.LogError(ex, "Playwright error during SRI scraping");
            return new SriDocumentsResponse
            {
                IsSuccess = false,
                ErrorMessage = $"Playwright scraping error: {ex.Message}",
                RecaptchaSiteKey = request.CaptureRecaptchaValues ? capturedRecaptchaSiteKey : null,
                RecaptchaToken = request.CaptureRecaptchaValues ? capturedRecaptchaToken : null
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error during Playwright SRI scraping");
            return new SriDocumentsResponse
            {
                IsSuccess = false,
                ErrorMessage = $"Playwright scraping error: {ex.Message}",
                RecaptchaSiteKey = request.CaptureRecaptchaValues ? capturedRecaptchaSiteKey : null,
                RecaptchaToken = request.CaptureRecaptchaValues ? capturedRecaptchaToken : null
            };
        }
    }

    private string ExtractViewState(string html)
    {
        var match = Regex.Match(html, @"name=""javax\.faces\.ViewState""\s+id=""javax\.faces\.ViewState""\s+value=""([^""]+)""");
        return match.Success ? match.Groups[1].Value : string.Empty;
    }

    private Dictionary<string, string> BuildJsfAjaxFormData(SriDocumentsRequest request, string viewState)
    {
        var formData = new Dictionary<string, string>
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
            { "g-recaptcha-response", request.RecaptchaToken ?? string.Empty },
            { "javax.faces.ViewState", viewState }
        };

        return formData;
    }

    private List<SriDocument> ParseJsfPartialResponse(string responseXml)
    {
        var documents = new List<SriDocument>();

        try
        {
            // The response is JSF partial response XML
            // Extract the table data from CDATA sections
            if (string.IsNullOrWhiteSpace(responseXml))
            {
                return documents;
            }

            var cdataMatches = Regex.Matches(responseXml, @"<!\[CDATA\[(.*?)\]\]>", RegexOptions.Singleline);

            foreach (Match cdataMatch in cdataMatches)
            {
                var content = cdataMatch.Groups[1].Value;

                if (string.IsNullOrWhiteSpace(content))
                {
                    continue;
                }

                // Look for table rows with document data
                // This is a simplified parser - actual implementation would need more robust HTML parsing
                var rowMatches = Regex.Matches(content, @"<tr[^>]*class=""[^""]*rf-dt-r[^""]*""[^>]*>(.*?)</tr>", RegexOptions.Singleline);

                foreach (Match rowMatch in rowMatches)
                {
                    var rowHtml = rowMatch.Groups[1].Value;

                    // Extract document information from table cells
                    // This would need to be adjusted based on actual table structure
                    var doc = ParseDocumentRow(rowHtml);
                    if (doc != null)
                    {
                        documents.Add(doc);
                    }
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Error parsing JSF partial response for received documents");
        }

        return documents;
    }

    private SriDocument? ParseDocumentRow(string rowHtml)
    {
        try
        {
            // Extract data from table cells
            // This is a simplified implementation - would need actual HTML parsing
            var cellMatches = Regex.Matches(rowHtml, @"<td[^>]*>(.*?)</td>", RegexOptions.Singleline);

            if (cellMatches.Count < 5)
                return null;

            return new SriDocument
            {
                // Map cells to document properties based on table structure
                // This would need to be adjusted based on actual response format
                DocumentType = StripHtml(cellMatches[0].Groups[1].Value),
                DocumentNumber = StripHtml(cellMatches[1].Groups[1].Value),
                IssueDate = ParseDate(StripHtml(cellMatches[2].Groups[1].Value)),
                IssuerName = StripHtml(cellMatches[3].Groups[1].Value),
                TotalAmount = ParseAmount(StripHtml(cellMatches[4].Groups[1].Value))
            };
        }
        catch
        {
            return null;
        }
    }

    private string StripHtml(string html)
    {
        return Regex.Replace(html, @"<[^>]+>", "").Trim();
    }

    private DateTime ParseDate(string dateStr)
    {
        if (DateTime.TryParse(dateStr, out var date))
            return date;
        return DateTime.MinValue;
    }

    private decimal ParseAmount(string amountStr)
    {
        amountStr = Regex.Replace(amountStr, @"[^\d,\.]", "");
        if (decimal.TryParse(amountStr, out var amount))
            return amount;
        return 0;
    }

}
