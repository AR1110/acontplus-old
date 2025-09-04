using Restaurant.Domain.Entities;

namespace Restaurant.Domain.Repositories;

public interface IRecipeRepository
{
    public Task<SpResponse> GetAsync();
    public Task<SpResponse> GetByIdAsync(int id);
    public Task<SpResponse> CreateAsync(Recipe recipe);
    public Task<SpResponse> UpdateAsync(int id, Recipe recipe);
    public Task<SpResponse> RemoveAsync(int userId, int id);
    Task<SpResponse> GetByItem(Dictionary<string, object> parameters);
}
