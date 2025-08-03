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

            if (string.IsNullOrEmpty(sessionCode) || string.IsNullOrEmpty(executionCode))
            {
                _logger.LogError("Failed to extract session parameters from auth page");
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
        Dictionary<string, string> cookies)
    {
        try
        {
            var loginUrl = $"/auth/realms/{_options.Realm}/login-actions/authenticate" +
                         $"?session_code={Uri.EscapeDataString(sessionCode)}" +
                         $"&execution={Uri.EscapeDataString(executionCode)}" +
                         $"&client_id={Uri.EscapeDataString(_options.ClientId)}";

            var formData = new Dictionary<string, string>
            {
                ["username"] = username,
                ["usuario"] = username,
                ["password"] = password,
                ["session_code"] = sessionCode,
                ["execution"] = executionCode,
                ["client_id"] = _options.ClientId,
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
            request.Headers.Referrer = new Uri($"{_options.BaseUrl}{loginUrl}");

            // Don't follow redirects automatically
            var handler = new HttpClientHandler { AllowAutoRedirect = false };
            using var tempClient = new HttpClient(handler);
            tempClient.DefaultRequestHeaders.Clear();
            foreach (var header in _httpClient.DefaultRequestHeaders)
            {
                tempClient.DefaultRequestHeaders.Add(header.Key, header.Value);
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
                }
            }

            // Fallback - check response content
            var content = await response.Content.ReadAsStringAsync();
            if (content.Contains("sri-en-linea"))
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
                ErrorMessage = "Login form submission failed",
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
            return new SriAuthenticationResult
            {
                IsSuccess = true,
                AccessToken = doc.RootElement.GetProperty("access_token").GetString(),
                RefreshToken = doc.RootElement.GetProperty("refresh_token").GetString(),
                ExpiresIn = doc.RootElement.GetProperty("expires_in").GetInt32(),
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
        // Try to extract from form action
        var match = Regex.Match(content, @"action=""[^""]*[?&]execution=([^&""'>\s]+)", RegexOptions.IgnoreCase);
        if (match.Success) return match.Groups[1].Value;

        // Try to extract from hidden input
        match = Regex.Match(content, @"<input[^>]*name=""execution""[^>]*value=""([^""]+)""", RegexOptions.IgnoreCase);
        if (match.Success) return match.Groups[1].Value;

        return string.Empty;
    }

    private string MaskUsername(string username) =>
        string.IsNullOrEmpty(username) || username.Length <= 4
            ? "***"
            : username.Substring(0, 4) + new string('*', username.Length - 4);
}
