using Common.AppSettings;

namespace Contabilidad.API.Interfaces;

public interface ISubcategoryService
{
    Task<LegacyApiResponse> AddAsync(Subcategory subcategory);
    Task<LegacyApiResponse> DeleteAsync(int userId, int id);
    Task<LegacyApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<LegacyApiResponse> UpdateAsync(int id, Subcategory subcategory);
}
