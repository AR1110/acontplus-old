using Microsoft.AspNetCore.Http;

namespace Services.Common.Middleware;
public class ConnStrRequestMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {

        var connectionString = context.Request.Headers["X-CONN-STR"].ToString();

        context.Items["ConnectionString"] = connectionString;

        await next(context);
    }

}
