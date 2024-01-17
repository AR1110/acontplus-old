using Common.Core.Models;
using Inventario.Core.Entities;

namespace Inventario.Core.Interfaces
{
    public interface ISubcategoryPhotoService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> AddAsync(SubcategoryPhoto data);
        Task<ApiResponse> UpdateAsync(int id, SubcategoryPhoto data);
        Task<object> DeleteAsync(int id, int userId);
    }
}
