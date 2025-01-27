namespace Configuracion.API.Interfaces.Printing;

public interface IPrinterService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<Printer> GetByIdAsync(int id);
    Task<object> AddAsync(Printer printer);
    Task<object> UpdateAsync(int id, Printer printer);
    Task<object> DeleteAsync(int id, int userId);
}
