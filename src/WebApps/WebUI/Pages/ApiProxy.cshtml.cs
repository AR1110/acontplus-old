using System.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace WebUI.Pages;

/// <summary>
/// API Proxy that forwards requests to a backend API while maintaining the original
/// request details and returning the API response to the client.
/// </summary>
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
    public async Task<IActionResult> OnHeadAsync() => await ProxyRequest();
    public async Task<IActionResult> OnOptionsAsync() => await ProxyRequest();

    /// <summary>
    /// Proxies the incoming request to the configured API endpoint
    /// </summary>
    private async Task<IActionResult> ProxyRequest()
    {
        try
        {
            // Get API base URL from configuration, consider using a named client
            var apiBaseUrl = _config["ApiGateways:ApiBaseUrl"];
            if (string.IsNullOrEmpty(apiBaseUrl))
            {
                _logger.LogError("API base URL not configured");
                return StatusCode(StatusCodes.Status500InternalServerError, "API gateway configuration missing");
            }

            // Validate and sanitize the path parameter
            var path = Request.Query["path"].ToString();
            if (string.IsNullOrWhiteSpace(path))
            {
                return BadRequest("Missing 'path' query parameter");
            }

            // Prevent path traversal attacks
            if (path.Contains("../") || path.Contains("..\\"))
            {
                _logger.LogWarning("Potential path traversal attempt: {Path}", path);
                return BadRequest("Invalid path");
            }

            // Remove leading slashes to avoid double slashes in the URL
            path = path.TrimStart('/');

            // Create the full target URL
            var targetUrl = $"{apiBaseUrl.TrimEnd('/')}/{path}";

            // Add query string parameters (except 'path')
            var queryParams = HttpContext.Request.QueryString.Value;
            if (!string.IsNullOrEmpty(queryParams))
            {
                // Create a new QueryString without the 'path' parameter
                var queryCollection = System.Web.HttpUtility.ParseQueryString(queryParams);
                queryCollection.Remove("path");

                var remainingQuery = queryCollection.ToString();
                if (!string.IsNullOrEmpty(remainingQuery))
                {
                    targetUrl += (targetUrl.Contains("?") ? "&" : "?") + remainingQuery;
                }
            }

            _logger.LogInformation("Proxying request to {TargetUrl}", targetUrl);

            // Create the HTTP client with a timeout
            var client = _httpClientFactory.CreateClient("ApiProxy");

            // Create the request message with the same HTTP method
            var requestMessage = new HttpRequestMessage
            {
                Method = new HttpMethod(Request.Method),
                RequestUri = new Uri(targetUrl)
            };

            // Copy relevant headers from the original request
            await CopyRequestHeadersAsync(requestMessage);

            // Copy the request body if present
            await CopyRequestBodyAsync(requestMessage);

            // Send the request with a cancellation token (from the HttpContext if available)
            var cancellationToken = HttpContext.RequestAborted;
            var response = await client.SendAsync(
                requestMessage,
                HttpCompletionOption.ResponseHeadersRead,
                cancellationToken);

            // Return the response
            return await CreateActionResultFromResponseAsync(response);
        }
        catch (OperationCanceledException ex)
        {
            _logger.LogInformation(ex, "Request cancelled");
            return StatusCode(499); // Client Closed Request
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Error connecting to API");
            return StatusCode(StatusCodes.Status502BadGateway, "Unable to connect to API");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in proxy request");
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred processing the request");
        }
    }

    /// <summary>
    /// Copies relevant headers from the incoming request to the outgoing request
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
                // If the header can't be added to the request headers, it might be a content header
                requestMessage.Content ??= new StreamContent(new MemoryStream());
                requestMessage.Content.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray());
            }
        }

        // Add forwarded headers for the backend to understand the original client
        var forwardedFor = Request.Headers["X-Forwarded-For"].FirstOrDefault();
        var clientIp = forwardedFor ?? HttpContext.Connection.RemoteIpAddress?.ToString();

        if (!string.IsNullOrEmpty(clientIp))
        {
            requestMessage.Headers.TryAddWithoutValidation("X-Forwarded-For", clientIp);
        }

        requestMessage.Headers.Add("X-Forwarded-Proto", Request.Scheme);
        requestMessage.Headers.Add("X-Forwarded-Host", Request.Host.Value);
    }

    /// <summary>
    /// Copies the request body from the incoming request to the outgoing request
    /// </summary>
    private async Task CopyRequestBodyAsync(HttpRequestMessage requestMessage)
    {
        if (Request.ContentLength > 0 && Request.Body.CanRead)
        {
            // Create a memory stream to preserve the request body
            var memoryStream = new MemoryStream();
            await Request.Body.CopyToAsync(memoryStream);

            // Reset position to the beginning for reading
            memoryStream.Position = 0;

            // Create the content from the memory stream
            requestMessage.Content = new StreamContent(memoryStream);

            // Set the content type if available
            var contentType = Request.ContentType;
            if (!string.IsNullOrEmpty(contentType))
            {
                requestMessage.Content.Headers.ContentType = MediaTypeHeaderValue.Parse(contentType);
            }
        }
    }

    /// <summary>
    /// Creates an action result from the API response
    /// </summary>
    private async Task<IActionResult> CreateActionResultFromResponseAsync(HttpResponseMessage response)
    {
        // Read the response content
        var responseContent = await response.Content.ReadAsByteArrayAsync();

        // Get the content type or default to application/json
        var contentTypeResult = response.Content.Headers.ContentType?.ToString()
            ?? "application/json; charset=utf-8";

        // Create a response with the same status code and content type
        var result = new FileContentResult(responseContent, contentTypeResult);

        // Set the status code on the response
        Response.StatusCode = (int)response.StatusCode;

        // Copy relevant response headers
        foreach (var header in response.Headers)
        {
            Response.Headers[header.Key] = header.Value.ToArray();
        }

        foreach (var header in response.Content.Headers)
        {
            // Skip content-type as it's already set in the FileContentResult
            if (string.Equals(header.Key, "Content-Type", StringComparison.OrdinalIgnoreCase))
            {
                continue;
            }

            Response.Headers[header.Key] = header.Value.ToArray();
        }

        return result;
    }
}
