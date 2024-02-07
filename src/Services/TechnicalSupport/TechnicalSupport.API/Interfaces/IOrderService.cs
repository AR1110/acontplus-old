using Common.Core.Models;
using TechnicalSupport.API.Entities;

namespace TechnicalSupport.API.Interfaces
{
    public interface IOrderService
    {
        Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
        Task<string> AddAsync(Dictionary<string, object> parameters);
        Task<string> UpdateAsync(Dictionary<string, object> parameters);
        Task<bool> DeleteAsync(int id);
    }
}
