using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Services.Common.Errors;
using Services.Common.Logs;

namespace Services.Common.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ICustomLogger _customLogger;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger,
            IHostEnvironment env, ICustomLogger customLogger)
        {
            _env = env;
            _logger = logger;
            _next = next;
            _customLogger = customLogger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                var response = _env.IsDevelopment()
                    ? new ApiException(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString())
                    : new ApiException(context.Response.StatusCode, $"Internal Server Error");

                var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

                var json = JsonSerializer.Serialize(new ApiException(context.Response.StatusCode, $"Internal Server Error: \n Message: {ex.Message} \n {ex.StackTrace?.ToString()}"), options);

                _customLogger.LogActivity(json, context.Response.StatusCode.ToString());

                await context.Response.WriteAsync(json);
            }
        }
    }
}
