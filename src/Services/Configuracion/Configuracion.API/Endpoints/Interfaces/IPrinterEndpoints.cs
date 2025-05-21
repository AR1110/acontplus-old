namespace Configuracion.API.Endpoints.Interfaces;

public interface IPrinterEndpoints
{
    Task<IResult> GetPrinters(string json);
    Task<IResult> GetPrinterById(int id);
    Task<IResult> CreatePrinter(Printer printer);
    Task<IResult> UpdatePrinter(int id, Printer printer);
    Task<IResult> DeletePrinter(int id);
}