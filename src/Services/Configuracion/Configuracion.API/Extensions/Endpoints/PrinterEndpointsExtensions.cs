using Configuracion.API.Endpoints.Interfaces;

namespace Configuracion.API.Extensions.Endpoints;

public static class PrinterEndpointsExtensions
{
    private const string ApiGroup = "/api/";

    public static WebApplication MapPrinterEndpoints(this WebApplication app)
    {
        // Create a scope to resolve scoped services
        using (var scope = app.Services.CreateScope())
        {
            var serviceProvider = scope.ServiceProvider;

            // Resolve the endpoints within the scope
            var endpoints = serviceProvider.GetRequiredService<IPrinterEndpoints>();
            var endpointsPrinterType = serviceProvider.GetRequiredService<IPrinterTypeEndpoints>();
            var endpointsPrint = serviceProvider.GetRequiredService<IPrintEndpoints>();
            var endpointsPrinterDocument = serviceProvider.GetRequiredService<IPrinterDocumentEndpoints>();

            // Map the Printer endpoints
            var apiGroup = app.MapGroup($"{ApiGroup}Printer")
                .RequireAuthorization()
                .WithOpenApi()
                .WithTags("Printer");

            apiGroup.MapGet("/", endpoints.GetPrinters);
            apiGroup.MapGet("/{id}", endpoints.GetPrinterById);
            apiGroup.MapPost("/", endpoints.CreatePrinter);
            apiGroup.MapPut("/{id}", endpoints.UpdatePrinter);
            apiGroup.MapDelete("/{id}", endpoints.DeletePrinter);

            // Map the PrinterType endpoints
            var printerTypeGroup = app.MapGroup($"{ApiGroup}PrinterType")
                .RequireAuthorization()
                .WithOpenApi()
                .WithTags("PrinterType");

            printerTypeGroup.MapGet("/", endpointsPrinterType.GetPrinterTypes);

            // Map the Print endpoints
            var printGroup = app.MapGroup($"{ApiGroup}Print")
                .RequireAuthorization()
                .WithOpenApi()
                .WithTags("Print");

            printGroup.MapGet("/", endpointsPrint.Print);

            // Map the PrinterDocument endpoints
            var printerDocumentGroup = app.MapGroup($"{ApiGroup}PrinterDocument")
                .RequireAuthorization()
                .WithOpenApi()
                .WithTags("PrinterDocument");

            printerDocumentGroup.MapPost("/", endpointsPrinterDocument.CreatePrinterDocument);
            printerDocumentGroup.MapPut("/{id}", endpointsPrinterDocument.UpdatePrinterDocument);
        }

        return app;
    }
}
