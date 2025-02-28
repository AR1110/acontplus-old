using Common.API.Endpoints.Interfaces;

namespace Common.API.Extensions;

public static class CommonEndpointsExtensions
{
    public static WebApplication MapCommonEndpoints(this WebApplication app)
    {
        var apiGroup = app.MapGroup("/api")
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("Dashbaord;Releases");

        var endpoints = app.Services.GetRequiredService<ICommonEndpoints>();
        //dashboard data

        apiGroup.MapGet("/dashboard", endpoints.GetDashboardAsync);
        //releases data
        apiGroup.MapGet("/release", endpoints.GetReleaseAsync);

        return app;
    }
}
