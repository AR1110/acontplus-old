namespace Configuration.Api.Endpoints.LicenseEndpoints;

public static class RegisterLicenseEndpoints
{
    public static void MapLicenseEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGetEndpoints();
        app.MapCreateEndpoints();
        app.MapUpdateEndpoints();
        app.MapDeleteEndpoints();
    }
}
