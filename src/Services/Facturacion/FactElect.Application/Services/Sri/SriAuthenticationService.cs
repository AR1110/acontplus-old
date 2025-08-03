using FactElect.Application.DTOs;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Text.Json;

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
        _httpClient.DefaultRequestHeaders.Add("User-Agent", _options.UserAgent);
        _httpClient.DefaultRequestHeaders.Add("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
        _httpClient.DefaultRequestHeaders.Add("Accept-Language", "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3");
        _httpClient.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate");
        _httpClient.DefaultRequestHeaders.Add("Connection", "keep-alive");
        _httpClient.DefaultRequestHeaders.Add("Upgrade-Insecure-Requests", "1");
    }

    public async Task<SriAuthenticationResult> AuthenticateAsync(string username, string password, string? additionalCi = null)
    {
        try
        {
            _logger.LogInformation("Starting SRI authentication for user: {Username}", username.Substring(0, 4) + "***");

            // Step 1: Get login page and extract session parameters
            var loginPageResult = await GetLoginPageAsync();
            if (!loginPageResult.IsSuccess)
                return loginPageResult;

            // Step 2: Perform authentication
            var authResult = await PerformAuthenticationAsync(
                username, password, additionalCi,
                loginPageResult.SessionCode!, loginPageResult.ExecutionCode!,
                loginPageResult.Cookies);

            if (authResult.IsSuccess)
            {
                _logger.LogInformation("Authentication successful for user: {Username}", username.Substring(0, 4) + "***");
            }
            else
            {
                _logger.LogWarning("Authentication failed for user: {Username}. Error: {Error}",
                    username.Substring(0, 4) + "***", authResult.ErrorMessage);
            }

            return authResult;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during SRI authentication");
            return new SriAuthenticationResult
            {
                IsSuccess = false,
                ErrorMessage = $"Authentication error: {ex.Message}"
            };
        }
    }

    private async Task<SriAuthenticationResult> GetLoginPageAsync()
    {
        try
        {
            var loginUrl = $"/auth/realms/{_options.Realm}/protocol/openid-connect/auth" +
                          $"?client_id={_options.ClientId}" +
                          "&redirect_uri=" + Uri.EscapeDataString($"{_options.BaseUrl}/sri-en-linea/") +
                          "&state=" + Guid.NewGuid().ToString("N") +
                          "&response_mode=fragment" +
                          "&response_type=code" +
                          "&scope=openid" +
                          "&nonce=" + Guid.NewGuid().ToString("N");

            var response = await _httpClient.GetAsync(loginUrl);
            var content = await response.Content.ReadAsStringAsync();

            // Extract cookies
            var cookies = ExtractCookies(response.Headers);

            // Extract session_code and execution from the form action URL or hidden inputs
            var sessionCode = ExtractParameterFromContent(content, "session_code");
            var executionCode = ExtractParameterFromContent(content, "execution");

            if (string.IsNullOrEmpty(sessionCode) || string.IsNullOrEmpty(executionCode))
            {
                return new SriAuthenticationResult
                {
                    IsSuccess = false,
                    ErrorMessage = "Failed to extract session parameters from login page"
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
            return new SriAuthenticationResult
            {
                IsSuccess = false,
                ErrorMessage = $"Failed to get login page: {ex.Message}"
            };
        }
    }

    private async Task<SriAuthenticationResult> PerformAuthenticationAsync(
        string username, string password, string? additionalCi,
        string sessionCode, string executionCode, Dictionary<string, string> cookies)
    {
        try
        {
            var authUrl = $"/auth/realms/{_options.Realm}/login-actions/authenticate" +
                         $"?session_code={sessionCode}" +
                         $"&execution={executionCode}" +
                         $"&client_id={_options.ClientId}" +
                         $"&tab_id=" + GenerateTabId();

            // Prepare form data
            var formData = new List<KeyValuePair<string, string>>
            {
                new("username", username),
                new("usuario", username),
                new("password", password),
                new("login", "Ingresar")
            };

            if (!string.IsNullOrEmpty(additionalCi))
            {
                formData.Add(new("ciAdicional", additionalCi));
            }

            var request = new HttpRequestMessage(HttpMethod.Post, authUrl)
            {
                Content = new FormUrlEncodedContent(formData)
            };

            // Add cookies to request
            AddCookiesToRequest(request, cookies);

            var response = await _httpClient.SendAsync(request);
            var responseContent = await response.Content.ReadAsStringAsync();

            // Check for successful authentication
            if (response.Headers.Location != null)
            {
                var location = response.Headers.Location.ToString();

                // Extract access token from redirect URL fragment or query
                var accessToken = ExtractTokenFromLocation(location, "access_token");
                var refreshToken = ExtractTokenFromLocation(location, "refresh_token");

                if (!string.IsNullOrEmpty(accessToken))
                {
                    return new SriAuthenticationResult
                    {
                        IsSuccess = true,
                        AccessToken = accessToken,
                        RefreshToken = refreshToken,
                        SessionCode = sessionCode,
                        ExecutionCode = executionCode,
                        Cookies = ExtractCookies(response.Headers),
                        ExpiresAt = DateTime.UtcNow.AddHours(8) // Typical JWT expiration
                    };
                }
            }

            // Check for authentication errors in response content
            if (responseContent.Contains("error") || responseContent.Contains("invalid"))
            {
                return new SriAuthenticationResult
                {
                    IsSuccess = false,
                    ErrorMessage = "Invalid credentials or authentication failed"
                };
            }

            // If we get here, authentication might have succeeded but we need to handle the session
            var newCookies = ExtractCookies(response.Headers);

            return new SriAuthenticationResult
            {
                IsSuccess = true,
                SessionCode = sessionCode,
                ExecutionCode = executionCode,
                Cookies = newCookies.Count > 0 ? newCookies : cookies,
                ExpiresAt = DateTime.UtcNow.AddHours(8)
            };
        }
        catch (Exception ex)
        {
            return new SriAuthenticationResult
            {
                IsSuccess = false,
                ErrorMessage = $"Authentication request failed: {ex.Message}"
            };
        }
    }

    public async Task<SriAuthenticationResult> RefreshTokenAsync(string refreshToken)
    {
        try
        {
            var tokenUrl = $"/auth/realms/{_options.Realm}/protocol/openid-connect/token";

            var formData = new List<KeyValuePair<string, string>>
            {
                new("grant_type", "refresh_token"),
                new("refresh_token", refreshToken),
                new("client_id", _options.ClientId)
            };

            var request = new HttpRequestMessage(HttpMethod.Post, tokenUrl)
            {
                Content = new FormUrlEncodedContent(formData)
            };

            var response = await _httpClient.SendAsync(request);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                var tokenData = JsonSerializer.Deserialize<JsonElement>(responseContent);

                return new SriAuthenticationResult
                {
                    IsSuccess = true,
                    AccessToken = tokenData.GetProperty("access_token").GetString(),
                    RefreshToken = tokenData.TryGetProperty("refresh_token", out var rt) ? rt.GetString() : refreshToken,
                    ExpiresAt = DateTime.UtcNow.AddSeconds(tokenData.GetProperty("expires_in").GetInt32())
                };
            }

            return new SriAuthenticationResult
            {
                IsSuccess = false,
                ErrorMessage = "Failed to refresh token"
            };
        }
        catch (Exception ex)
        {
            return new SriAuthenticationResult
            {
                IsSuccess = false,
                ErrorMessage = $"Token refresh failed: {ex.Message}"
            };
        }
    }

    public async Task<bool> ValidateTokenAsync(string accessToken)
    {
        try
        {
            var introspectUrl = $"/auth/realms/{_options.Realm}/protocol/openid-connect/token/introspect";

            var formData = new List<KeyValuePair<string, string>>
            {
                new("token", accessToken),
                new("client_id", _options.ClientId)
            };

            var request = new HttpRequestMessage(HttpMethod.Post, introspectUrl)
            {
                Content = new FormUrlEncodedContent(formData)
            };

            var response = await _httpClient.SendAsync(request);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                var introspectionData = JsonSerializer.Deserialize<JsonElement>(responseContent);
                return introspectionData.GetProperty("active").GetBoolean();
            }

            return false;
        }
        catch
        {
            return false;
        }
    }

    #region Helper Methods

    private Dictionary<string, string> ExtractCookies(System.Net.Http.Headers.HttpResponseHeaders headers)
    {
        var cookies = new Dictionary<string, string>();

        if (headers.TryGetValues("Set-Cookie", out var cookieValues))
        {
            foreach (var cookie in cookieValues)
            {
                var parts = cookie.Split(';')[0].Split('=', 2);
                if (parts.Length == 2)
                {
                    cookies[parts[0].Trim()] = parts[1].Trim();
                }
            }
        }

        return cookies;
    }

    private void AddCookiesToRequest(HttpRequestMessage request, Dictionary<string, string> cookies)
    {
        if (cookies.Any())
        {
            var cookieHeader = string.Join("; ", cookies.Select(kvp => $"{kvp.Key}={kvp.Value}"));
            request.Headers.Add("Cookie", cookieHeader);
        }
    }

    private string ExtractParameterFromContent(string content, string parameterName)
    {
        // Extract from form action URL
        var actionMatch = System.Text.RegularExpressions.Regex.Match(
            content, $@"{parameterName}=([^&""'>\s]+)");

        return actionMatch.Success ? actionMatch.Groups[1].Value : string.Empty;
    }

    private string ExtractTokenFromLocation(string location, string tokenName)
    {
        var match = System.Text.RegularExpressions.Regex.Match(
            location, $@"{tokenName}=([^&]+)");

        return match.Success ? Uri.UnescapeDataString(match.Groups[1].Value) : string.Empty;
    }

    private string GenerateTabId()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
        var random = new Random();
        return new string(Enumerable.Repeat(chars, 11)
            .Select(s => s[random.Next(s.Length)]).ToArray());
    }

    #endregion
}
