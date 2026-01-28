namespace Identity.Api.Endpoints.LicenseAccessDetailEndpoints;

public static class RegisterLicenseAccessDetailEndpoints
{
    public static void MapLicenseAccessDetailEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGetEndpoints();
        app.MapCreateEndpoints();
        app.MapUpdateEndpoints();
        app.MapDeleteEndpoints();
    }
}
