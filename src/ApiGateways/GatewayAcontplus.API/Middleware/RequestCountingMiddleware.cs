using GatewayAcontplus.API.Entities;
using GatewayAcontplus.API.Services;
using Ocelot.Middleware;

namespace GatewayAcontplus.API.Middleware;
public class RequestCountingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IMessageQueueService _queueService;

    public RequestCountingMiddleware(RequestDelegate next, IMessageQueueService queueService)
    {
        _next = next;
        _queueService = queueService;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var downstreamPath = context.Items.DownstreamRoute()?.DownstreamPathTemplate.Value;
        var originalRequestBody = context.Request.Body;
        var originalResponseBody = context.Response.Body;

        using (var requestBody = new MemoryStream())
        {
            await context.Request.Body.CopyToAsync(requestBody);
            var requestSize = requestBody.Length;
            requestBody.Seek(0, SeekOrigin.Begin);
            context.Request.Body = requestBody;

            using (var responseBody = new MemoryStream())
            {
                context.Response.Body = responseBody;

                await _next(context); // Procesa la solicitud y espera la respuesta

                responseBody.Seek(0, SeekOrigin.Begin);
                var responseSize = responseBody.Length;

                var apiRequest = new ApiRequest
                {
                    Path = context.Request.Path,
                    Timestamp = DateTime.UtcNow,
                    DownstreamPath = downstreamPath,
                    RequestSize = requestSize,
                    ResponseSize = responseSize
                };

                // Enviar la solicitud a RabbitMQ
                _queueService.EnqueueRequest(apiRequest);

                // Restaura la respuesta original y copia el contenido
                responseBody.Seek(0, SeekOrigin.Begin);
                await responseBody.CopyToAsync(originalResponseBody);
            }

            context.Request.Body = originalRequestBody;
        }
    }
}
