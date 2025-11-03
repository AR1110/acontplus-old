using Configuration.API.Endpoints.PrintEndpoints;
using Configuration.API.Endpoints.PrinterDocumentEndpoints;
using Configuration.API.Endpoints.PrinterEndpoints;
using Configuration.API.Endpoints.PrinterTypeEndpoints;

namespace Configuration.API.Endpoints;

public static class RegisterEndpoints
{
    public static void MapAllEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPrinterEndpoints();
        app.MapPrinterDocumentEndpoints();
        app.MapPrinterTypeEndpoints();
        app.MapPrintEndpoints();
    }
}
