namespace Inventario.Domain.Repositories;

public interface IProductPhotoRepository
{
    Task<ApiResponse> GetAsync(int productId);
    Task<ApiResponse> AddAsync(ProductPhoto productPhoto);
    Task<ApiResponse> UpdateAsync(int id, ProductPhoto productPhoto);
    Task<ApiResponse> SetDefaultAsync(int id, bool isDefault, int userId);
    Task<ApiResponse> DeleteAsync(int id, int userId);
}