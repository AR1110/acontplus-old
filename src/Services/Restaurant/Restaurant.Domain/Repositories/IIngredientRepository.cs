namespace Restaurant.Domain.Repositories;

public interface IIngredientRepository
{
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> GetByIdAsync(int id);
    Task<SpResponse> AddAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateAsync(int id, Ingredient ingredient);
    Task<SpResponse> DeleteAsync(int userId, int id);
}
