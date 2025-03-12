namespace Configuracion.Application.Interfaces.Printing;

public interface IPrinterService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<Printer> GetByIdAsync(int id);
    Task<ApiResponse> AddAsync(Printer printer);
    Task<ApiResponse> UpdateAsync(int id, Printer printer);
    Task<ApiResponse> DeleteAsync(int id, int userId);
}
