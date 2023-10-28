using Common.Core.Models;

namespace Inventario.Core.Interfaces
{
    public interface IStockFisicoService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<string> AddAsync(ApiRequest data);
        Task<string> UpdateAsync(int id, ApiRequest data);
    }
}
