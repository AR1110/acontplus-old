using Inventario.Core.Entities;
using Lib.Common.Api;

namespace Inventario.Core.Interfaces
{
    public interface IStockFisicoService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<APIResponse> AddAsync(StockFisico stockFisico);
    }
}
