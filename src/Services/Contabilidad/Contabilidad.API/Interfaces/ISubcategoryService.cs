using Common.AppSettings;

namespace Contabilidad.API.Interfaces;

public interface ISubcategoryService
{
    Task<ApiResponseDeprecated> AddAsync(Subcategory subcategory);
    Task<ApiResponseDeprecated> DeleteAsync(int userId, int id);
    Task<ApiResponseDeprecated> GetAsync(Dictionary<string, object> parameters);
    Task<ApiResponseDeprecated> UpdateAsync(int id, Subcategory subcategory);
}
