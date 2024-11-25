using Common.AppSettings;

namespace Inventario.API.Interfaces;

public interface ISubcategoryPhotoService
{
    Task<object> GetAsync(Dictionary<string, object> parameters);
    Task<LegacyApiResponse> AddAsync(SubcategoryPhoto data);
    Task<LegacyApiResponse> UpdateAsync(int id, SubcategoryPhoto data);
    Task<object> DeleteAsync(int id, int userId);
}
