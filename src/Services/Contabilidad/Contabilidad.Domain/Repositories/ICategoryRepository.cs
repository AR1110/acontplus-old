namespace Contabilidad.Domain.Repositories;

public interface ICategoryRepository
{
    Task<ApiResponse> AddAsync(Category category);
    Task<ApiResponse> DeleteAsync(int userId, int id);
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(int id, Category category);
}
