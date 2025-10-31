namespace Inventory.Domain.Repositories;

public interface IProductPhotoRepository
{
    Task<SpResponse> GetAsync(int productId);
    Task<SpResponse> AddAsync(ProductPhoto productPhoto);
    Task<SpResponse> UpdateAsync(int id, ProductPhoto productPhoto);
    Task<SpResponse> SetDefaultAsync(int id, bool isDefault, int userId);
    Task<SpResponse> DeleteAsync(int id, int userId);
}
