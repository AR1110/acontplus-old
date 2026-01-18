namespace Identity.Api.Endpoints.LicenciaAccesoDetalleEndpoints;

public static class RegisterLicenciaAccesoDetalleEndpoints
{
    public static void MapLicenciaAccesoDetalleEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGetEndpoints();
        app.MapCreateEndpoints();
        app.MapUpdateEndpoints();
        app.MapDeleteEndpoints();
    }
}