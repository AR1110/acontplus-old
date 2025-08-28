namespace Restaurant.Domain.Repositories;

public interface IOrderRepository
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> PutAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> DeleteAsync(int userId, int id);
    Task<ApiResponse> PrintAsync(Dictionary<string, object> parameters);
}
