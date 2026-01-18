namespace Identity.Api.Endpoints.LicenciaAccesoEndpoints;

public static class RegisterLicenciaAccesoEndpoints
{
    public static void MapLicenciaAccesoEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGetEndpoints();
        app.MapCreateEndpoints();
        app.MapUpdateEndpoints();
        app.MapDeleteEndpoints();
    }
}