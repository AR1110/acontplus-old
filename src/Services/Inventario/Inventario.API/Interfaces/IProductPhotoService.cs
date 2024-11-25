using Common.AppSettings;

namespace Inventario.API.Interfaces;

public interface IProductPhotoService
{
    Task<LegacyApiResponse> GetAsync(int productId);
    Task<LegacyApiResponse> AddAsync(ProductPhoto productPhoto);
    Task<LegacyApiResponse> UpdateAsync(int id, ProductPhoto productPhoto);
    Task<LegacyApiResponse> SetDefaultAsync(int id, bool isDefault, int userId);
    Task<LegacyApiResponse> DeleteAsync(int id, int userId);
}
