namespace Configuration.Api.Endpoints.LicenciaEndpoints;

public static class RegisterLicenciaEndpoints
{
    public static void MapLicenciaEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGetEndpoints();
        app.MapCreateEndpoints();
        app.MapUpdateEndpoints();
        app.MapDeleteEndpoints();
    }
}


