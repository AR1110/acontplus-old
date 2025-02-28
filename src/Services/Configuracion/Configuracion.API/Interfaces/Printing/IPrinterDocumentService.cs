namespace Configuracion.API.Interfaces.Printing;

public interface IPrinterDocumentService
{
    Task<ApiResponse> AddAsync(PrinterDocument printerDocument);
    Task<ApiResponse> UpdateAsync(int id, PrinterDocument printerDocument);
}
