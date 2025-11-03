namespace Accounting.Domain.Repositories;

public interface ICategoryRepository
{
    Task<SpResponse> AddAsync(Category category);
    Task<SpResponse> DeleteAsync(int userId, int id);
    Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    Task<SpResponse> UpdateAsync(int id, Category category);
}
