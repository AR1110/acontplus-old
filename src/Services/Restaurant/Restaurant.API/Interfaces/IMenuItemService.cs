using Common.Core.Models;

namespace Restaurant.API.Interfaces;

public interface IMenuItemService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> GetIdAsync(Dictionary<string, object> parameters);
}
