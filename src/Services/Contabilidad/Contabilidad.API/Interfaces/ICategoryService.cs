namespace Contabilidad.API.Interfaces;

public interface ICategoryService
{
    Task<ApiResponseDeprecated> AddAsync(Category category);
    Task<ApiResponseDeprecated> DeleteAsync(int userId, int id);
    Task<ApiResponseDeprecated> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponseDeprecated> UpdateAsync(int id, Category category);
}
