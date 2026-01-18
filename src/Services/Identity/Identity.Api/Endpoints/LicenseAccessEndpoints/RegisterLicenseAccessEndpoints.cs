namespace Identity.Api.Endpoints.LicenseAccessEndpoints;

public static class RegisterLicenseAccessEndpoints
{
    public static void MapLicenseAccessEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGetEndpoints();
        app.MapCreateEndpoints();
        app.MapUpdateEndpoints();
        app.MapDeleteEndpoints();
    }
}
