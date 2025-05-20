namespace Configuracion.API.Endpoints.Interfaces;

public interface IPrinterDocumentEndpoints
{
    Task<IResult> CreatePrinterDocument(PrinterDocument printerDocument);
    Task<IResult> UpdatePrinterDocument(int id, PrinterDocument printerDocument);
}