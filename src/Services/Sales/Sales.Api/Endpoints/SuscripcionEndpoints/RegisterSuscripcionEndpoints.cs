namespace Sales.Api.Endpoints.SuscripcionEndpoints;

public static class RegisterSuscripcionEndpoints
{
    public static void MapSuscripcionEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGetEndpoints();
        app.MapCreateEndpoints();
        app.MapUpdateEndpoints();
        app.MapDeleteEndpoints();
    }
}