using Common.Core.Models;

namespace Restaurant.API.Interfaces;

public interface IOrderService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> AddAsync(ApiRequest data);
    Task<ApiResponse> PutAsync(int id, ApiRequest data);
    Task<ApiResponse> DeleteAsync(int userId, int id);
    Task<ApiResponse> PrintAsync(Dictionary<string, object> parameters);
}
