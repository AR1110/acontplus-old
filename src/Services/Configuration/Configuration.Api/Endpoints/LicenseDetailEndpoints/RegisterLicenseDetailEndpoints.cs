namespace Configuration.Api.Endpoints.LicenseDetailEndpoints;

public static class RegisterLicenseDetailEndpoints
{
    public static void MapLicenseDetailEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGetEndpoints();
        app.MapCreateEndpoints();
        app.MapUpdateEndpoints();
        app.MapDeleteEndpoints();
    }
}
