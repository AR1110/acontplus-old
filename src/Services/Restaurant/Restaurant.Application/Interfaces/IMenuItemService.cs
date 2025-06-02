namespace Restaurant.Application.Interfaces;

public interface IMenuItemService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> GetIdAsync(Dictionary<string, object> parameters);
}