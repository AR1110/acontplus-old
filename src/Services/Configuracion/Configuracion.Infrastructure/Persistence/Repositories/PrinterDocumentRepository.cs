namespace Configuracion.Infrastructure.Persistence.Repositories;

public class PrinterDocumentRepository(ConfigContext context) : IPrinterDocumentRepository
{
    public async Task<SpResponse> AddAsync(PrinterDocument printerDocument)
    {
        await context.PrinterDocuments.AddAsync(printerDocument);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Registrado exitosamente", Payload = printerDocument };
    }

    public async Task<SpResponse> UpdateAsync(int id, PrinterDocument printerDocument)
    {
        if (id != printerDocument.Id) return new SpResponse { Code = "0", Message = "Id Incorrecto" };

        var document = await context.PrinterDocuments.FindAsync(id);
        document.UpdatedByUserId = printerDocument.UpdatedByUserId;
        document.IsActive = printerDocument.IsActive;
        document.Copies = printerDocument.Copies;
        context.Update(document);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Actualizado exitosamente" };
    }
}
