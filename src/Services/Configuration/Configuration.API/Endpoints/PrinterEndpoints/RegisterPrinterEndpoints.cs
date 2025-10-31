namespace Configuration.API.Endpoints.PrinterEndpoints;

public static class RegisterPrinterEndpoints
{
    public static void MapPrinterEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapCreateEndpoints();
        app.MapGetEndpoints();
        app.MapUpdateEndpoints();
        app.MapDeleteEndpoints();
    }
}
