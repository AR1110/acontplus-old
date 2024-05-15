using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Services.Common.Errors;
using Services.Common.Logs;

namespace Services.Common.Middleware;

public class ExceptionMiddleware(
    RequestDelegate next,
    ILogger<ExceptionMiddleware> logger,
    IHostEnvironment env,
    ICustomLogger customLogger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, ex.Message);
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var response = env.IsDevelopment()
                ? new ApiException(context.Response.StatusCode, ex.Message, ex.StackTrace)
                : new ApiException(context.Response.StatusCode, "Internal Server Error");

            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

            var json = JsonSerializer.Serialize(
                new ApiException(context.Response.StatusCode,
                    $"Internal Server Error: \n Message: {ex.Message} \n {ex.StackTrace}"), options);

            customLogger.LogActivity(json, context.Response.StatusCode.ToString());

            var clientResponse = JsonSerializer.Serialize(response, options);
            await context.Response.WriteAsync(clientResponse);
        }
    }
}
