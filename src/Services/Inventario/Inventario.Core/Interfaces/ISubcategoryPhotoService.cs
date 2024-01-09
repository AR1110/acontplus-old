using Common.Core.Models;
using Inventario.Core.Entities;

namespace Inventario.Core.Interfaces
{
    public interface ISubcategoryPhotoService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<APIResponse> AddAsync(SubcategoryPhoto data);
        Task<APIResponse> UpdateAsync(int id, SubcategoryPhoto data);
        Task<object> DeleteAsync(int id, int userId);
    }
}
