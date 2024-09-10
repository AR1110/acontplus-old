using Common.Core.Models;

namespace Restaurant.API.Interfaces;

public interface IItemService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> GetByIdAsync(int id);
    Task<ApiResponse> UpdateAsync(int id, ApiRequest request);
    Task<ApiResponse> DeleteAsync(int id, ApiRequest request);
}
