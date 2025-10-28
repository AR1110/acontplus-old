namespace TechnicalSupport.Domain.Repositories;

public interface ICategoryRepository
{
    public Task<SpResponse> AddAsync(Category category);
    public Task<SpResponse> DeleteAsync(int userId, int id);
    public Task<SpResponse> GetAsync(Dictionary<string, object> parameters);
    public Task<SpResponse> UpdateAsync(int id, Category category);
}
