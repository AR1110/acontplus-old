namespace Common.Api.Endpoints.DashboardEndpoints;

public static class RegisterDashboardEndpoints
{
    public static void MapDashboardEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGetEndpoints();
    }
}