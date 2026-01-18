namespace Common.Api.Endpoints.BugsEndpoints;

public static class RegisterBugsEndpoints
{
    public static void MapBugsEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGetEndpoints();
    }
}