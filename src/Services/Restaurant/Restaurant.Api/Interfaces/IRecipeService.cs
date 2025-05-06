using Restaurant.API.Entities;

namespace Restaurant.API.Interfaces;

public interface IRecipeService
{
    public Task<ApiResponse> GetAsync();
    public Task<ApiResponse> GetByIdAsync(int id);
    public Task<ApiResponse> CreateAsync(Recipe recipe);
    public Task<ApiResponse> UpdateAsync(int id, Recipe recipe);
    public Task<ApiResponse> RemoveAsync(int userId, int id);
    Task<ApiResponse> GetByItem(Dictionary<string, object> parameters);
}
