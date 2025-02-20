using Common.AppSettings;

namespace Contabilidad.API.Interfaces;

public interface ICategoryService
{
    Task<ApiResponse> AddAsync(Category category);
    Task<ApiResponse> DeleteAsync(int userId, int id);
    Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponse> UpdateAsync(int id, Category category);
}
