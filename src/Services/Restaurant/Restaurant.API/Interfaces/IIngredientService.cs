using Common.Core.Models;

namespace Restaurant.API.Interfaces;

public interface IIngredientService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> GetByIdAsync(int id);
    Task<ApiResponse> AddAsync(ApiRequest parameters);
    Task<ApiResponse> UpdateAsync(int id, ApiRequest data);
    Task<ApiResponse> DeleteAsync(int userId, int id);
}
