using Common.AppSettings;

namespace Contabilidad.API.Interfaces;

public interface ICategoryService
{
    Task<LegacyApiResponse> AddAsync(Category category);
    Task<LegacyApiResponse> DeleteAsync(int userId, int id);
    Task<LegacyApiResponse> GetAsync(Dictionary<string, object> parameters);
    Task<LegacyApiResponse> UpdateAsync(int id, Category category);
}
