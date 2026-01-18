namespace Configuration.Api.Endpoints.LicenciaDetalleEndpoints;

public static class RegisterLicenciaDetalleEndpoints
{
    public static void MapLicenciaDetalleEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGetEndpoints();
        app.MapCreateEndpoints();
        app.MapUpdateEndpoints();
        app.MapDeleteEndpoints();
    }
}