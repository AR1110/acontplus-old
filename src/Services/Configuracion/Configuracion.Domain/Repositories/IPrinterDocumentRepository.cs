namespace Configuracion.Domain.Repositories;

public interface IPrinterDocumentRepository
{
    Task<ApiResponse> AddAsync(PrinterDocument printerDocument);
    Task<ApiResponse> UpdateAsync(int id, PrinterDocument printerDocument);
}
