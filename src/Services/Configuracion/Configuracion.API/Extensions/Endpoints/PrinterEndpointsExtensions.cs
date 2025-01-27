using Configuracion.API.Endpoints.Interfaces;

namespace Configuracion.API.Extensions.Endpoints;

public static class PrinterEndpointsExtensions
{
    private const string ApiGroup = "/api/";

    public static WebApplication MapPrinterEndpoints(this WebApplication app)
    {
        var apiGroup = app.MapGroup($"{ApiGroup}Printer")
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("Printer");

        var endpoints = app.Services.GetRequiredService<IPrinterEndpoints>();

        apiGroup.MapGet("/", endpoints.GetPrinters);
        apiGroup.MapGet("/{id}", endpoints.GetPrinterById);
        apiGroup.MapPost("/", endpoints.CreatePrinter);
        apiGroup.MapPut("/{id}", endpoints.UpdatePrinter);
        apiGroup.MapDelete("/{id}", endpoints.DeletePrinter);


        var printerTypeGroup = app.MapGroup($"{ApiGroup}PrinterType")
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("PrinterType");

        var endpointsPrinterType = app.Services.GetRequiredService<IPrinterTypeEndpoints>();
        printerTypeGroup.MapGet("/", endpointsPrinterType.GetPrinterTypes);

        var printGroup = app.MapGroup($"{ApiGroup}Print")
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("Print");

        var endpointsPrint = app.Services.GetRequiredService<IPrintEndpoints>();
        printGroup.MapGet("/", endpointsPrint.Print);

        var printerDocumentGroup = app.MapGroup($"{ApiGroup}PrinterDocument")
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("PrinterDocument");

        var endpointsPrinterDocument = app.Services.GetRequiredService<IPrinterDocumentEndpoints>();
        printerDocumentGroup.MapPost("/", endpointsPrinterDocument.CreatePrinterDocument);
        printerDocumentGroup.MapPut("/{id}", endpointsPrinterDocument.UpdatePrinterDocument);

        return app;
    }
}
