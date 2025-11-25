using Configuration.Api.Endpoints.PrintEndpoints;
using Configuration.Api.Endpoints.PrinterDocumentEndpoints;
using Configuration.Api.Endpoints.PrinterEndpoints;
using Configuration.Api.Endpoints.PrinterTypeEndpoints;

namespace Configuration.Api.Endpoints;

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
