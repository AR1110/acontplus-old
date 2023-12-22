using Common.Core.Models;

namespace Compras.API.Interfaces
{
    public interface ILiquidacionCompraService
    {

        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<string> AddAsync(ApiRequest request);
        Task<object> GetByIdAsync(Dictionary<string, object> parameters);
        Task<string> UpdateAsync(int id, ApiRequest request);
        Task<string> DeleteAsync(Dictionary<string, object> parameters);
    }
}
