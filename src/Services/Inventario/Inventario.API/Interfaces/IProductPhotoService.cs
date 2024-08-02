namespace Inventario.API.Interfaces;

public interface IProductPhotoService
{
    Task<ApiResponseDeprecated> GetAsync(int productId);
    Task<ApiResponseDeprecated> AddAsync(ProductPhoto productPhoto);
    Task<ApiResponseDeprecated> UpdateAsync(int id, ProductPhoto productPhoto);
    Task<ApiResponseDeprecated> SetDefaultAsync(int id, bool isDefault, int userId);
    Task<ApiResponseDeprecated> DeleteAsync(int id, int userId);
}
