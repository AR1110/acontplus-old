using Configuracion.API.Entities;

namespace Configuracion.API.Interfaces
{
    public interface IPrinterService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<Printer> GetByIdAsync(int id);
        Task<object> AddAsync(Printer printer);
        Task<object> UpdateAsync(int id, Printer printer);
        Task<object> DeleteAsync(int id, int userId);
    }
}
