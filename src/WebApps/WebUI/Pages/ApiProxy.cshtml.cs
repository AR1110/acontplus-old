using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Net;
using System.Net.Http.Headers;
using System.Text;

namespace WebUI.Pages;

[IgnoreAntiforgeryToken]
public class ApiProxyModel : PageModel
{
    private readonly IConfiguration _config;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<ApiProxyModel> _logger;
    private readonly HashSet<string> _excludedRequestHeaders = new(StringComparer.OrdinalIgnoreCase)
    {
        "Host", "Connection", "Content-Length", "Origin", "Referer", "User-Agent",
        "Transfer-Encoding" // Añadido para evitar conflictos con chunking
    };

    private readonly HashSet<string> _excludedResponseHeaders = new(StringComparer.OrdinalIgnoreCase)
    {
        "Transfer-Encoding", "Connection", "Keep-Alive"
    };

    public ApiProxyModel(IConfiguration config, IHttpClientFactory httpClientFactory, ILogger<ApiProxyModel> logger)
    {
        _config = config;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public override async Task OnPageHandlerExecutionAsync(PageHandlerExecutingContext context, PageHandlerExecutionDelegate next)
    {
        var result = await ProxyRequest();
        context.Result = result;
    }

    private async Task<IActionResult> ProxyRequest()
    {
        try
        {
            var apiBaseUrl = _config["ApiGateways:Acontplus"];
            if (string.IsNullOrEmpty(apiBaseUrl))
            {
                _logger.LogError("API base URL not configured");
                return StatusCode(500, "API gateway configuration missing");
            }

            var path = Request.Query["path"].ToString();
            if (string.IsNullOrWhiteSpace(path))
                return BadRequest("Missing 'path' query parameter");

            path = path.TrimStart('/');
            var targetUrl = BuildTargetUrl(apiBaseUrl, path);
            _logger.LogInformation("Proxying {Method} request to {TargetUrl}", Request.Method, targetUrl);

            var client = _httpClientFactory.CreateClient();
            client.Timeout = TimeSpan.FromMinutes(5);

            // Configurar cliente para manejar correctamente respuestas de contenido grande
            client.DefaultRequestHeaders.Add("Connection", "Keep-Alive");
            client.DefaultRequestHeaders.Add("Keep-Alive", "timeout=600, max=1000");

            var requestMessage = new HttpRequestMessage
            {
                Method = new HttpMethod(Request.Method),
                RequestUri = new Uri(targetUrl)
            };

            CopyRequestHeaders(requestMessage);
            await CopyRequestBodyAsync(requestMessage);

            // Cambiar a StreamContent para mejor manejo de respuestas grandes
            var response = await client.SendAsync(
                requestMessage,
                HttpCompletionOption.ResponseHeadersRead,
                HttpContext.RequestAborted);

            // Copiar status code y headers
            Response.StatusCode = (int)response.StatusCode;
            CopyResponseHeaders(response);

            // Para respuestas no exitosas, enviar como texto
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                return Content(errorContent, response.Content.Headers.ContentType?.ToString() ?? "text/plain");
            }

            try
            {
                // Leer el contenido completo para evitar problemas de streaming
                var content = await response.Content.ReadAsByteArrayAsync();

                // Devolver como un FileContentResult en lugar de StreamResult para evitar problemas de chunking
                return new FileContentResult(
                    content,
                    response.Content.Headers.ContentType?.ToString() ?? "application/json");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error reading response content");
                return StatusCode(502, "Error reading from upstream server");
            }
        }
        catch (OperationCanceledException ex)
        {
            _logger.LogInformation(ex, "Request cancelled");
            return StatusCode(499);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Error connecting to API");
            return StatusCode(502, "Unable to connect to API");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error");
            return StatusCode(500, "An unexpected error occurred");
        }
    }

    private string BuildTargetUrl(string apiBaseUrl, string path)
    {
        var baseTargetUrl = $"{apiBaseUrl.TrimEnd('/')}/{path}";
        var queryParams = HttpContext.Request.Query.Where(p => !string.Equals(p.Key, "path", StringComparison.OrdinalIgnoreCase)).ToList();

        if (queryParams.Count == 0) return baseTargetUrl;

        var queryBuilder = new StringBuilder("?");

        for (int i = 0; i < queryParams.Count; i++)
        {
            var param = queryParams[i];
            var encodedKey = WebUtility.UrlEncode(param.Key);

            for (int j = 0; j < param.Value.Count; j++)
            {
                if (i > 0 || j > 0) queryBuilder.Append('&');
                var encodedValue = WebUtility.UrlEncode(param.Value[j]);
                queryBuilder.Append($"{encodedKey}={encodedValue}");
            }
        }

        var finalUrl = baseTargetUrl + queryBuilder;
        if (finalUrl.Length > 2000 && HttpMethods.IsGet(Request.Method) &&
            _config.GetValue<bool>("ApiProxy:UsePostForLongGetQueries", false))
        {
            _logger.LogWarning("Query string length ({Length}) exceeds safe limit", finalUrl.Length);
        }

        return finalUrl;
    }

    private void CopyRequestHeaders(HttpRequestMessage requestMessage)
    {
        foreach (var header in Request.Headers)
        {
            if (_excludedRequestHeaders.Contains(header.Key)) continue;

            if (!requestMessage.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray()))
            {
                _logger.LogDebug("Header {Header} will be added as content header if applicable", header.Key);
            }
        }

        var clientIp = HttpContext.Connection.RemoteIpAddress?.ToString();
        if (!string.IsNullOrEmpty(clientIp))
            requestMessage.Headers.TryAddWithoutValidation("X-Forwarded-For", clientIp);

        requestMessage.Headers.TryAddWithoutValidation("X-Forwarded-Proto", Request.Scheme);
        requestMessage.Headers.TryAddWithoutValidation("X-Forwarded-Host", Request.Host.Value);
        requestMessage.Headers.TryAddWithoutValidation("X-Original-Method", Request.Method);
    }

    private async Task CopyRequestBodyAsync(HttpRequestMessage requestMessage)
    {
        // Enable request body buffering to allow multiple reads
        Request.EnableBuffering();
        Request.Body.Position = 0;

        // Check if there's actually content in the body
        var hasRequestBody = Request.ContentLength.HasValue && Request.ContentLength.Value > 0;

        // For POST, PUT, PATCH with actual body content, use the request body directly
        if (hasRequestBody && (Request.Method is "POST" or "PUT" or "PATCH"))
        {
            // Leer todo el contenido del body para evitar problemas de streaming
            using var ms = new MemoryStream();
            await Request.Body.CopyToAsync(ms);
            ms.Position = 0;

            // Usar ByteArrayContent en lugar de StreamContent para mayor consistencia
            var bytes = ms.ToArray();
            requestMessage.Content = new ByteArrayContent(bytes);

            // Set content type from the original request
            var contentType = Request.ContentType;
            if (!string.IsNullOrEmpty(contentType))
            {
                try
                {
                    requestMessage.Content.Headers.ContentType = MediaTypeHeaderValue.Parse(contentType);
                }
                catch
                {
                    requestMessage.Content.Headers.TryAddWithoutValidation("Content-Type", contentType);
                }
            }
        }
        // For POST/PUT/PATCH without a body but with a json query parameter, use that as the body
        else if (!hasRequestBody && (Request.Method is "POST" or "PUT" or "PATCH") &&
                 Request.Query.TryGetValue("json", out var jsonValues) &&
                 !string.IsNullOrEmpty(jsonValues.FirstOrDefault()))
        {
            requestMessage.Content = new StringContent(jsonValues.First(), Encoding.UTF8, "application/json");
        }
        // For POST/PUT/PATCH without a body and no json parameter, convert query parameters to JSON body
        else if (!hasRequestBody && (Request.Method is "POST" or "PUT" or "PATCH"))
        {
            var dict = Request.Query
                .Where(p => !string.Equals(p.Key, "path", StringComparison.OrdinalIgnoreCase))
                .ToDictionary(p => p.Key, p => p.Value.Count == 1 ? (object)p.Value[0] : p.Value.ToArray());

            if (dict.Count > 0)
            {
                var jsonPayload = System.Text.Json.JsonSerializer.Serialize(dict);
                requestMessage.Content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
            }
            else
            {
                // Empty POST/PUT/PATCH request
                requestMessage.Content = new StringContent("", Encoding.UTF8, "application/json");
            }
        }

        // Only copy content headers if we have content
        if (requestMessage.Content != null)
        {
            foreach (var header in Request.Headers)
            {
                if (_excludedRequestHeaders.Contains(header.Key)) continue;

                if (header.Key.StartsWith("Content-", StringComparison.OrdinalIgnoreCase) &&
                    !header.Key.Equals("Content-Type", StringComparison.OrdinalIgnoreCase))
                {
                    requestMessage.Content.Headers.TryAddWithoutValidation(header.Key, header.Value.ToArray());
                }
            }
        }

        // Reset the body position for potential future reads
        if (hasRequestBody)
        {
            Request.Body.Position = 0;
        }
    }

    private void CopyResponseHeaders(HttpResponseMessage response)
    {
        // Copiar headers de la respuesta, excluyendo los que causan problemas
        foreach (var header in response.Headers)
        {
            if (_excludedResponseHeaders.Contains(header.Key))
                continue;

            Response.Headers[header.Key] = header.Value.ToArray();
        }

        // Copiar headers de contenido, excluyendo Transfer-Encoding
        foreach (var header in response.Content.Headers)
        {
            if (_excludedResponseHeaders.Contains(header.Key))
                continue;

            Response.Headers[header.Key] = header.Value.ToArray();
        }

        // Opcional: Añadir soporte CORS si es necesario
        Response.Headers["Access-Control-Allow-Origin"] = "*";
    }
}
