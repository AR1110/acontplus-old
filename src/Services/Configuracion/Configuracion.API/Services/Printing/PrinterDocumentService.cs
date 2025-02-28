namespace Configuracion.API.Services.Printing;

public class PrinterDocumentService(ConfigContext context) : IPrinterDocumentService
{
    public async Task<ApiResponse> AddAsync(PrinterDocument printerDocument)
    {
        await context.PrinterDocuments.AddAsync(printerDocument);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Registrado exitosamente", Payload = printerDocument };
    }

    public async Task<ApiResponse> UpdateAsync(int id, PrinterDocument printerDocument)
    {
        if (id != printerDocument.Id)
        {
            return new ApiResponse { Code = "0", Message = "Id Incorrecto" };
        }

        var document = await context.PrinterDocuments.FindAsync(id);
        document!.UserId = printerDocument.UserId;
        document.Enabled = printerDocument.Enabled;
        document.Copies = printerDocument.Copies;
        context.Update(document);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Actualizado exitosamente" };
    }
}
