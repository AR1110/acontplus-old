namespace Configuration.Api.Endpoints.PrinterTypeEndpoints;

public static class RegisterPrinterTypeEndpoints
{
    public static void MapPrinterTypeEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGetEndpoints();
    }
}
