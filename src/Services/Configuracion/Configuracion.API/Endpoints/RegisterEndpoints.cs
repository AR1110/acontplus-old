using Configuracion.API.Endpoints.PrintEndpoints;
using Configuracion.API.Endpoints.PrinterDocumentEndpoints;
using Configuracion.API.Endpoints.PrinterEndpoints;
using Configuracion.API.Endpoints.PrinterTypeEndpoints;

namespace Configuracion.API.Endpoints;

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
