namespace Configuracion.API.Endpoints.PrinterDocumentEndpoints;

public static class RegisterEndpoints
{
    public static void MapPrinterDocumentEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapCreateEndpoints();
        app.MapUpdateEndpoints();
    }
}
