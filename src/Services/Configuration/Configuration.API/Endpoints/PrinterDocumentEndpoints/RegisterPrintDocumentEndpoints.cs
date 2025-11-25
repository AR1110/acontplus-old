namespace Configuration.Api.Endpoints.PrinterDocumentEndpoints;

public static class RegisterPrintDocumentEndpoints
{
    public static void MapPrinterDocumentEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapCreateEndpoints();
        app.MapUpdateEndpoints();
    }
}
