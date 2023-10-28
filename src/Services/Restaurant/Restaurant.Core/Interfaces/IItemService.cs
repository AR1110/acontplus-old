using Common.Core.Models;

namespace Restaurant.Core.Interfaces
{
    public interface IItemService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<object> GetByIdAsync(int id);
        Task<string> UpdateAsync(int id, ApiRequest request);
        Task<string> DeleteAsync(int id, ApiRequest request);
    }
}
