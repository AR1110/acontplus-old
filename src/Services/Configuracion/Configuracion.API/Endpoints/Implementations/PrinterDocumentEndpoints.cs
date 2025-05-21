using Configuracion.API.Endpoints.Interfaces;

namespace Configuracion.API.Endpoints.Implementations;

public class PrinterDocumentEndpoints(IPrinterDocumentService printerDocumentService, IUserContext userContext)
    : IPrinterDocumentEndpoints
{
    public async Task<IResult> CreatePrinterDocument(PrinterDocument printerDocument)
    {
        printerDocument.UserId = userContext.GetUserId();
        return Results.Ok(await printerDocumentService.AddAsync(printerDocument));
    }

    public async Task<IResult> UpdatePrinterDocument(int id, PrinterDocument printerDocument)
    {
        printerDocument.UserId = userContext.GetUserId();
        return Results.Ok(await printerDocumentService.UpdateAsync(id, printerDocument));
    }
}