namespace Sales.Api.Endpoints.SuscripcionDetalleEndpoints;

public static class RegisterSuscripcionDetalleEndpoints
{
    public static void MapSuscripcionDetalleEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGetEndpoints();
        app.MapDeleteEndpoints();
    }
}