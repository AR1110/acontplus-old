using TechnicalSupport.Core.Entities;

namespace TechnicalSupport.Core.Interfaces
{
    public interface IOrderService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<string> AddAsync(Dictionary<string, object> parameters);
        Task<string> UpdateAsync(Dictionary<string, object> parameters);
        Task<bool> DeleteAsync (int id);
    }
}
