using Common.Core.Models;
using Inventario.Core.Entities;

namespace Inventario.Core.Interfaces
{
    public interface IProductPhotoService
    {
        Task<APIResponse> GetAsync(int productId);
        Task<APIResponse> AddAsync(ProductPhoto productPhoto); 
        Task<APIResponse> UpdateAsync(int id, ProductPhoto productPhoto);
        Task<APIResponse> SetDefaultAsync(int id, bool isDefault, int userId);
        Task<APIResponse> DeleteAsync(int id, int userId);
    }
}
