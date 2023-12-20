using Common.Core.Models;
using Inventario.Core.Entities;

namespace Inventario.Core.Interfaces
{
    public interface IProductPhotoService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<APIResponse> AddAsync(ProductPhoto productPhoto); 
        Task<APIResponse> UpdateAsync(int id, ProductPhoto productPhoto);
        Task<object> DeleteAsync(int id, int userId);
    }
}
