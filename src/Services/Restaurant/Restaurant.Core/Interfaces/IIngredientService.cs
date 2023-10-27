using Common.Core.Models;

namespace Restaurant.Core.Interfaces
{
    public interface IIngredientService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<object> GetByIdAsync(int id);
        Task<string> AddAsync(ApiRequest parameters);
        Task<string> UpdateAsync(int id, ApiRequest data);
        Task<bool> DeleteAsync(int id);
    }
}