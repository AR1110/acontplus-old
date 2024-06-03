using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
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
                
                var stackTrace = ex.StackTrace?.Replace(Environment.NewLine, "\n");

                var response = env.IsDevelopment()
                    ? new ApiException(context.Response.StatusCode, ex.Message, stackTrace)
                    : new ApiException(context.Response.StatusCode, "Internal Server Error");

                var options = new JsonSerializerSettings
                {
                    ContractResolver = new DefaultContractResolver
                    {
                        NamingStrategy = new CamelCaseNamingStrategy()
                    }
                };

                // Create a detailed log message
                var logDetails = new
                {
                    context.Response.StatusCode,
                    ex.Message,
                    StackTrace = stackTrace?.Split('\n'),
                    InnerException = ex.InnerException?.ToString(),
                    ex.Source
                };

                var logJson = JsonConvert.SerializeObject(logDetails, Formatting.Indented, options);
                customLogger.LogActivity(logJson, context.Response.StatusCode.ToString());

                var clientResponse = JsonConvert.SerializeObject(response, options);
                await context.Response.WriteAsync(clientResponse);
            }
        }
    }
