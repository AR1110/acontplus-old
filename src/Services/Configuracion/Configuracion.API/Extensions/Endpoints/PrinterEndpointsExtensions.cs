namespace Configuracion.API.Extensions.Endpoints;

public static class PrinterEndpointsExtensions
{
    private const string ApiGroup = "/api/";

    public static IEndpointRouteBuilder MapPrinterEndpoints(this IEndpointRouteBuilder endpointRouteBuilder)
    {
        // Map the Printer endpoints
        var printerGroup = endpointRouteBuilder.MapGroup($"{ApiGroup}Printer")
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("Printer");


        printerGroup.MapGet("/", async (IPrinterEndpoints printerEndpoints, string json) =>
            await printerEndpoints.GetPrinters(json));

        printerGroup.MapGet("/{id}", async (IPrinterEndpoints printerEndpoints, int id) =>
            await printerEndpoints.GetPrinterById(id));

        printerGroup.MapPost("/", async (IPrinterEndpoints printerEndpoints, Printer printer) =>
            await printerEndpoints.CreatePrinter(printer));

        printerGroup.MapPut("/{id}", async (IPrinterEndpoints printerEndpoints, int id, Printer printer) =>
            await printerEndpoints.UpdatePrinter(id, printer));

        printerGroup.MapDelete("/{id}", async (IPrinterEndpoints printerEndpoints, int id) =>
            await printerEndpoints.DeletePrinter(id));

        // Map the PrinterType endpoints
        var printerTypeGroup = endpointRouteBuilder.MapGroup($"{ApiGroup}PrinterType")
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("PrinterType");

        printerTypeGroup.MapGet("/", async (IPrinterTypeEndpoints printerTypeEndpoints) =>
            await printerTypeEndpoints.GetPrinterTypes());

        // Map the Print endpoints
        var printGroup = endpointRouteBuilder.MapGroup($"{ApiGroup}Print")
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("Print");

        printGroup.MapGet("/", async (IPrintEndpoints printEndpoints, string json) =>
            await printEndpoints.Print(json));

        // Map the PrinterDocument endpoints
        var printerDocumentGroup = endpointRouteBuilder.MapGroup($"{ApiGroup}PrinterDocument")
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("PrinterDocument");

        printerDocumentGroup.MapPost("/",
            async (IPrinterDocumentEndpoints printerDocumentEndpoints, PrinterDocument printerDocument) =>
                await printerDocumentEndpoints.CreatePrinterDocument(printerDocument));

        printerDocumentGroup.MapPut("/{id}",
            async (IPrinterDocumentEndpoints printerDocumentEndpoints, int id, PrinterDocument printerDocument) =>
                await printerDocumentEndpoints.UpdatePrinterDocument(id, printerDocument));

        return endpointRouteBuilder;
    }
}