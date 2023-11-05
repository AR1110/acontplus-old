

using Common.Core.Models;

namespace Inventario.Core.Interfaces
{
    public interface IArticuloFraccionadoService
    { 
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<string> AddAsync(ApiRequest data);
        Task<string> UpdateAsync(int id, ApiRequest data);
        Task<string> DeleteAsync(Dictionary<string, object> parameters);

    }
}
