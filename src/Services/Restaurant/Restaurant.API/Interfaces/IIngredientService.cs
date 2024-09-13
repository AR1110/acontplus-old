using Common.Core.Models;
using Restaurant.API.Entities;

namespace Restaurant.API.Interfaces;

public interface IIngredientService
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> GetByIdAsync(int id);
    Task<ApiResponse> AddAsync(ApiRequest parameters);
    Task<ApiResponse> UpdateAsync(int id, Ingredient ingredient);
    Task<ApiResponse> DeleteAsync(int userId, int id);
}
