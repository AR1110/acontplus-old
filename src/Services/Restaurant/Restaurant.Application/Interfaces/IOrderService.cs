namespace Restaurant.Application.Interfaces;

public interface IOrderService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> AddAsync(ApiRequest data);
    Task<ApiResponse> PutAsync(int id, ApiRequest data);
    Task<ApiResponse> DeleteAsync(int userId, int id);
    Task<ApiResponse> PrintAsync(Dictionary<string, object> parameters);
}