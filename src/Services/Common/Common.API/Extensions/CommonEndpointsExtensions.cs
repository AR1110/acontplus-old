using Common.API.Endpoints.Interfaces;

namespace Common.API.Extensions;

public static class CommonEndpointsExtensions
{
    public static WebApplication MapCommonEndpoints(this WebApplication app)
    {
        var apiGroup = app.MapGroup("/api");

        //dashboard data
        apiGroup.MapGet("/dashboard", async ([FromServices] ICommonEndpoints endpoints, HttpContext context) =>
        {
            return await endpoints.GetDashboardAsync(context);
        });

        //releases data
        apiGroup.MapGet("/release", async ([FromServices] ICommonEndpoints endpoints, HttpContext context) =>
        {
            return await endpoints.GetReleaseAsync(context);
        });

        return app;
    }
}
