using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace FactElect.Application.Services.Sri;

public class SriAuthenticationService : ISriAuthenticationService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<SriAuthenticationService> _logger;
    private readonly SriAuthenticationOptions _options;

    public SriAuthenticationService(
        HttpClient httpClient,
        ILogger<SriAuthenticationService> logger,
        IOptions<SriAuthenticationOptions> options)
    {
        _httpClient = httpClient;
        _logger = logger;
        _options = options.Value;

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
        return length == 10 || length == 13 || (length >= 6 && length <= 20);
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
            if (response.StatusCode == HttpStatusCode.Redirect || response.StatusCode == HttpStatusCode.Found)
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
            if (response.StatusCode == HttpStatusCode.Redirect || response.StatusCode == HttpStatusCode.Found)
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

            if (hasSuccessIndicators && !content.Contains("kc-form-login"))
            {
                return new SriAuthenticationResult
                {
                    IsSuccess = true,
                    Cookies = cookies
                };
            }

            return new SriAuthenticationResult
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

            if (response.StatusCode == HttpStatusCode.Redirect || response.StatusCode == HttpStatusCode.Found)
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
        if (match.Success) return match.Groups[1].Value;

        return string.Empty;
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

}