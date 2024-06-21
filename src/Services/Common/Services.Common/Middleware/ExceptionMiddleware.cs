using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Services.Common.Middleware;

public class ExceptionMiddleware(
    RequestDelegate next,
    ILogger<ExceptionMiddleware> logger,
    IHostEnvironment env)
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

            var stackTrace = ex.StackTrace?.Replace(Environment.NewLine, "\n");

            var problemDetails = env.IsDevelopment()
                ? new ProblemDetails
                {
                    Status = context.Response.StatusCode,
                    Title = "Server Error: " + ex.Message,
                    Detail = stackTrace
                } : new ProblemDetails
                {
                    Status = context.Response.StatusCode,
                    Title = "Server Error" + ex.Message,
                };

            await context.Response.WriteAsJsonAsync(problemDetails);
        }
    }
}
