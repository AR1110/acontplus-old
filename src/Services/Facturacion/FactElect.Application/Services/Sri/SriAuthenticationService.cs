using FactElect.Application.DTOs;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;

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
            // Step 1: Initiate authorization request
            var authResult = await InitiateAuthorization();
            if (!authResult.IsSuccess)
                return authResult;

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
                return loginResult;

            // Step 3: Handle the response (either token in fragment or authorization code)
            if (!string.IsNullOrEmpty(loginResult.AccessToken))
            {
                // We already got tokens in fragment
                return loginResult;
            }

            if (!string.IsNullOrEmpty(loginResult.AuthorizationCode))
            {
                // Exchange authorization code for tokens
                return await ExchangeCodeForTokens(loginResult.AuthorizationCode, loginResult.Cookies);
            }

            return new SriAuthenticationResult
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

    private async Task<SriAuthenticationResult> InitiateAuthorization()
    {
        try
        {
            var authUrl = $"/auth/realms/{_options.Realm}/protocol/openid-connect/auth" +
                         $"?client_id={Uri.EscapeDataString(_options.ClientId)}" +
                         $"&redirect_uri={Uri.EscapeDataString(_options.RedirectUri)}" +
                         $"&response_type=code" +
                         $"&scope=openid" +
                         $"&state={Guid.NewGuid():N}" +
                         $"&nonce={Guid.NewGuid():N}";

            var request = new HttpRequestMessage(HttpMethod.Get, authUrl);
            var response = await _httpClient.SendAsync(request);
            var content = await response.Content.ReadAsStringAsync();
            var cookies = ExtractCookies(response);

            var sessionCode = ExtractSessionCode(content);
            var executionCode = ExtractExecutionCode(content);
            var tabId = ExtractTabId(content);

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

            // Add tab_id if available
            if (!string.IsNullOrEmpty(tabId))
            {
                loginUrl += $"&tab_id={Uri.EscapeDataString(tabId)}";
            }

            var formData = new Dictionary<string, string>
            {
                ["username"] = username,
                ["usuario"] = username,
                ["password"] = password,
                ["login"] = "Ingresar"
            };

            if (!string.IsNullOrEmpty(additionalCi))
            {
                formData["ciAdicional"] = additionalCi;
            }

            var request = new HttpRequestMessage(HttpMethod.Post, loginUrl)
            {
                Content = new FormUrlEncodedContent(formData)
            };

            AddCookiesToRequest(request, cookies);

            // Set proper referrer
            var referrerUrl = $"/auth/realms/{_options.Realm}/protocol/openid-connect/auth";
            request.Headers.Referrer = new Uri(_httpClient.BaseAddress, referrerUrl);

            // Create handler that doesn't follow redirects
            var handler = new HttpClientHandler { AllowAutoRedirect = false };
            using var tempClient = new HttpClient(handler);

            // Copy base address and headers from main client
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
            var responseCookies = ExtractCookies(response);

            // Merge cookies
            foreach (var cookie in responseCookies)
            {
                cookies[cookie.Key] = cookie.Value;
            }

            // Check for redirect with tokens in fragment
            if (response.StatusCode == HttpStatusCode.Redirect ||
                response.StatusCode == HttpStatusCode.Found)
            {
                var location = response.Headers.Location?.ToString();
                if (!string.IsNullOrEmpty(location))
                {
                    _logger.LogDebug("Redirect location: {Location}", location);

                    // Check for tokens in fragment
                    if (location.Contains("#"))
                    {
                        var fragment = location.Split('#')[1];
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

            // Check response content for success indicators
            var content = await response.Content.ReadAsStringAsync();
            _logger.LogDebug("Login response status: {StatusCode}", response.StatusCode);
            _logger.LogDebug("Login response content preview: {Content}",
                content.Substring(0, Math.Min(500, content.Length)));

            // Check for error messages in response
            if (content.Contains("error") || content.Contains("invalid") ||
                content.Contains("Usuario o clave incorrectos") ||
                content.Contains("authentication failed"))
            {
                return new SriAuthenticationResult
                {
                    IsSuccess = false,
                    ErrorMessage = "Invalid credentials or authentication failed",
                    Cookies = cookies
                };
            }

            // Check for success indicators
            if (content.Contains("sri-en-linea") || response.StatusCode == HttpStatusCode.OK)
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
                ErrorMessage = $"Unexpected response from login form: {response.StatusCode}",
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
}
