namespace Configuration.Domain.Repositories;

public interface IPrinterDocumentRepository
{
    Task<SpResponse> AddAsync(PrinterDocument printerDocument);
    Task<SpResponse> UpdateAsync(int id, PrinterDocument printerDocument);
}
