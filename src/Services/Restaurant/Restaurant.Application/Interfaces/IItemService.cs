namespace Restaurant.Application.Interfaces;

public interface IItemService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> GetByIdAsync(int id);
    Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
}
