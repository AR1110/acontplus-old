namespace Configuracion.API.Endpoints.Implementations;

public class PrinterDocumentEndpoints(IPrinterDocumentRepository printerDocumentService, IUserContext userContext)
    : IPrinterDocumentEndpoints
{
    public async Task<IResult> CreatePrinterDocument(PrinterDocument printerDocument)
    {
        printerDocument.CreatedByUserId = userContext.GetUserId();
        printerDocument.CreatedByUserId = userContext.GetUserId();
        return Results.Ok(await printerDocumentService.AddAsync(printerDocument));
    }

    public async Task<IResult> UpdatePrinterDocument(int id, PrinterDocument printerDocument)
    {
        printerDocument.UpdatedByUserId = userContext.GetUserId();
        return Results.Ok(await printerDocumentService.UpdateAsync(id, printerDocument));
    }
}
