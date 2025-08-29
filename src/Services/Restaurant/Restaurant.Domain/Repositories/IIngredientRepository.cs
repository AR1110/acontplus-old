using Restaurant.Domain.Entities;

namespace Restaurant.Domain.Repositories;

public interface IIngredientRepository
{
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> GetByIdAsync(int id);
    Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(int id, Ingredient ingredient);
    Task<ApiResponse> DeleteAsync(int userId, int id);
}
