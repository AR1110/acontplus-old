namespace Configuracion.API.Extensions.Endpoints;

public static class PrinterEndpointsExtensions
{
    public static WebApplication MapPrinterEndpoints(this WebApplication app, IHttpContextAccessor httpContextAccessor)
    {
        var apiGroup = app.MapGroup("/api");

        //apiGroup.MapPost("/", async (IPrinterService printerService, Printer printer) =>
        //{
        //    return Results.Ok(await printerService.AddAsync(printer));
        //});
        return app;
    }
}
