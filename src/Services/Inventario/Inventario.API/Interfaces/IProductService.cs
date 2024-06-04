using Common.Core.Models;

namespace Inventario.API.Interfaces;

public interface IProductService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
}
