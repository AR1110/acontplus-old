using System.Net;
using System.Net.Http.Headers;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace WebUI.Pages;

/// <summary>
/// API Proxy optimizado para manejar query strings largos, especialmente en métodos PUT
/// </summary>

[IgnoreAntiforgeryToken]
public class ApiProxyModel : PageModel
{
    private readonly IConfiguration _config;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<ApiProxyModel> _logger;
    private readonly HashSet<string> _excludedRequestHeaders = new(StringComparer.OrdinalIgnoreCase)
    {
        "Host",
        "Connection",
        "Content-Length",
        "Origin",
        "Referer",
        "User-Agent"
    };

    public ApiProxyModel(
        IConfiguration config,
        IHttpClientFactory httpClientFactory,
        ILogger<ApiProxyModel> logger)
    {
        _config = config;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public async Task<IActionResult> OnGetAsync() => await ProxyRequest();
    public async Task<IActionResult> OnPostAsync() => await ProxyRequest();
    public async Task<IActionResult> OnPutAsync() => await ProxyRequest();
    public async Task<IActionResult> OnDeleteAsync() => await ProxyRequest();
    public async Task<IActionResult> OnPatchAsync() => await ProxyRequest();

    /// <summary>
    /// Proxies the incoming request to the configured API endpoint with optimized handling for large query strings
    /// </summary>
    private async Task<IActionResult> ProxyRequest()
    {
        try
        {
            // Get API base URL from configuration
            var apiBaseUrl = _config["ApiGateways:ApiBaseUrl"];
            if (string.IsNullOrEmpty(apiBaseUrl))
            {
                _logger.LogError("API base URL not configured");
                return StatusCode(500, "API gateway configuration missing");
            }

            // Validate the path parameter
            var path = Request.Query["path"].ToString();
            if (string.IsNullOrWhiteSpace(path))
            {
                return BadRequest("Missing 'path' query parameter");
            }

            // Remove leading slashes to avoid double slashes in the URL
            path = path.TrimStart('/');

            // Construct target URL with full query string preservation
            var targetUrl = BuildTargetUrl(apiBaseUrl, path);
            _logger.LogInformation("Proxying {Method} request to {TargetUrl}", Request.Method, targetUrl);

            // Create HTTP client
            var client = _httpClientFactory.CreateClient();
            client.Timeout = TimeSpan.FromMinutes(5); // Increase timeout for large requests

            // Create request message
            var requestMessage = new HttpRequestMessage
            {
                Method = new HttpMethod(Request.Method),
                RequestUri = new Uri(targetUrl)
            };

            // Copy headers with special handling for content headers
            await CopyRequestHeadersAsync(requestMessage);

            // Copy request body with buffer size optimization
            if (Request.Method.Equals("PUT", StringComparison.OrdinalIgnoreCase) ||
                Request.Method.Equals("POST", StringComparison.OrdinalIgnoreCase) ||
                Request.Method.Equals("PATCH", StringComparison.OrdinalIgnoreCase))
            {
                await CopyRequestBodyAsync(requestMessage);
            }

            // Send the request
            var response = await client.SendAsync(
                requestMessage,
                HttpCompletionOption.ResponseHeadersRead,
                HttpContext.RequestAborted);

            // Set response headers and status code
            await CopyResponseHeadersAsync(response);
            Response.StatusCode = (int)response.StatusCode;

            // Stream the response content to avoid memory issues with large responses
            var responseStream = await response.Content.ReadAsStreamAsync();
            return new FileStreamResult(
                responseStream,
                response.Content.Headers.ContentType?.ToString() ?? "application/json");
        }
        catch (OperationCanceledException ex)
        {
            _logger.LogInformation(ex, "Request cancelled");
            return StatusCode(499); // Client Closed Request
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Error connecting to API");
            return StatusCode(502, "Unable to connect to API");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in proxy request");
            return StatusCode(500, "An error occurred processing the request");
        }
    }

    /// <summary>
    /// Builds the target URL preserving all query parameters except 'path'
    /// with special handling for large query strings
    /// </summary>
    private string BuildTargetUrl(string apiBaseUrl, string path)
    {
        var baseTargetUrl = $"{apiBaseUrl.TrimEnd('/')}/{path}";

        // Get all query params except 'path'
        var queryParams = HttpContext.Request.Query
            .Where(p => !string.Equals(p.Key, "path", StringComparison.OrdinalIgnoreCase))
            .ToList();

        if (queryParams.Count == 0)
        {
            return baseTargetUrl;
        }

        // Build query string manually to ensure proper encoding of large values
        var queryBuilder = new StringBuilder();
        queryBuilder.Append('?');

        for (int i = 0; i < queryParams.Count; i++)
        {
            var param = queryParams[i];

            if (i > 0)
            {
                queryBuilder.Append('&');
            }

            // Encode key and value properly to handle special characters
            var encodedKey = WebUtility.UrlEncode(param.Key);

            // Handle multi-value parameters
            if (param.Value.Count > 1)
            {
                for (int j = 0; j < param.Value.Count; j++)
                {
                    if (j > 0)
                    {
                        queryBuilder.Append('&');
                    }

                    var encodedValue = WebUtility.UrlEncode(param.Value[j]);
                    queryBuilder.Append($"{encodedKey}={encodedValue}");
                }
            }
            else
            {
                var encodedValue = WebUtility.UrlEncode(param.Value);
                queryBuilder.Append($"{encodedKey}={encodedValue}");
            }
        }

        // Check if query string is too long for a GET request
        var finalUrl = baseTargetUrl + queryBuilder.ToString();
        if (finalUrl.Length > 2000 &&
            HttpMethods.IsGet(Request.Method) &&
            _config.GetValue<bool>("ApiProxy:UsePostForLongGetQueries", false))
        {
            // For extremely long GET requests, we might want to consider
            // switching to POST with a special header, but this requires
            // backend support and is commented out by default
            _logger.LogWarning("Query string length ({Length}) exceeds recommended limits", finalUrl.Length);
        }

        return finalUrl;
    }

    /// <summary>
    /// Copies headers from the original request to the proxied request
    /// </summary>
    private async Task CopyRequestHeadersAsync(HttpRequestMessage requestMessage)
    {
        foreach (var header in Request.Headers)
        {
            if (_excludedRequestHeaders.Contains(header.Key))
            {
                continue;
            }

            if (!requestMessage.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray()))
            {
                // If it's a content header, we'll handle it when we create the content
                _logger.LogDebug("Couldn't add header {Header} to request headers, will try content headers", header.Key);
            }
        }

        // Add forwarded headers
        var clientIp = HttpContext.Connection.RemoteIpAddress?.ToString();
        if (!string.IsNullOrEmpty(clientIp))
        {
            requestMessage.Headers.TryAddWithoutValidation("X-Forwarded-For", clientIp);
        }

        requestMessage.Headers.Add("X-Forwarded-Proto", Request.Scheme);
        requestMessage.Headers.Add("X-Forwarded-Host", Request.Host.Value);
    }

    /// <summary>
    /// Copies the request body from the incoming request to the outgoing request
    /// with optimized handling for large bodies
    /// </summary>
    private async Task CopyRequestBodyAsync(HttpRequestMessage requestMessage)
    {
        if (Request.ContentLength > 0)
        {
            // For PUT requests with large query strings, ensure we can read the body
            Request.EnableBuffering();

            // Reset the request body position if needed
            if (Request.Body.Position != 0)
            {
                Request.Body.Position = 0;
            }

            // Create content from body stream
            // Using StreamContent instead of MemoryStream to handle large payloads efficiently
            requestMessage.Content = new StreamContent(Request.Body);

            // Copy content type and other content headers
            var contentType = Request.ContentType;
            if (!string.IsNullOrEmpty(contentType))
            {
                requestMessage.Content.Headers.ContentType = MediaTypeHeaderValue.Parse(contentType);
            }

            // Copy content headers that weren't added to the request headers
            foreach (var header in Request.Headers)
            {
                if (_excludedRequestHeaders.Contains(header.Key))
                {
                    continue;
                }

                if (header.Key.StartsWith("Content-", StringComparison.OrdinalIgnoreCase) &&
                    !header.Key.Equals("Content-Type", StringComparison.OrdinalIgnoreCase))
                {
                    requestMessage.Content.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray());
                }
            }
        }
        else
        {
            // For PUT/POST requests with no body, add an empty content to avoid HTTP 411 errors
            requestMessage.Content = new StringContent(string.Empty);

            // Si no hay body, intenta construir JSON desde los parámetros de query
            if (Request.ContentLength == null || Request.ContentLength == 0)
            {
                // Si se especificó un parámetro "json", úsalo directamente
                if (Request.Query.TryGetValue("json", out var jsonValues))
                {
                    var json = jsonValues.FirstOrDefault();
                    if (!string.IsNullOrEmpty(json))
                    {
                        requestMessage.Content = new StringContent(json, Encoding.UTF8, "application/json");
                        return;
                    }
                }

                // Construir JSON desde los parámetros de query (excepto 'path')
                var dict = Request.Query
                    .Where(p => !string.Equals(p.Key, "path", StringComparison.OrdinalIgnoreCase))
                    .ToDictionary(
                        p => p.Key,
                        p => p.Value.Count == 1 ? (object)p.Value[0] : p.Value.ToArray()
                    );

                var jsonPayload = System.Text.Json.JsonSerializer.Serialize(dict);
                requestMessage.Content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
            }
            else
            {
                // Ya hay cuerpo, usarlo directamente
                Request.EnableBuffering();
                if (Request.Body.Position != 0)
                {
                    Request.Body.Position = 0;
                }

                requestMessage.Content = new StreamContent(Request.Body);

                var contentType = Request.ContentType;
                if (!string.IsNullOrEmpty(contentType))
                {
                    requestMessage.Content.Headers.ContentType = MediaTypeHeaderValue.Parse(contentType);
                }

                foreach (var header in Request.Headers)
                {
                    if (_excludedRequestHeaders.Contains(header.Key))
                        continue;

                    if (header.Key.StartsWith("Content-", StringComparison.OrdinalIgnoreCase) &&
                        !header.Key.Equals("Content-Type", StringComparison.OrdinalIgnoreCase))
                    {
                        requestMessage.Content.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray());
                    }
                }
            }
        }
    }

    /// <summary>
    /// Copies response headers from the API response to the proxy response
    /// </summary>
    private async Task CopyResponseHeadersAsync(HttpResponseMessage response)
    {
        foreach (var header in response.Headers)
        {
            Response.Headers[header.Key] = header.Value.ToArray();
        }

        foreach (var header in response.Content.Headers)
        {
            // Skip content-type as it's handled by FileStreamResult
            if (string.Equals(header.Key, "Content-Type", StringComparison.OrdinalIgnoreCase))
            {
                continue;
            }

            Response.Headers[header.Key] = header.Value.ToArray();
        }
    }
}
