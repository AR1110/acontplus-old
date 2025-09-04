namespace Configuracion.Domain.Repositories;

public interface IPrinterRepository
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    Task<Printer> GetByIdAsync(int id);
    Task<SpResponse> AddAsync(Printer printer);
    Task<SpResponse> UpdateAsync(int id, Printer printer);
    Task<SpResponse> DeleteAsync(int id, int userId);
}
