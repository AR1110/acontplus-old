using Common.Core.Models;

namespace TechnicalSupport.API.Interfaces
{
    public interface IOrderMantenainceService
    {
        Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
        Task<bool> DeleteAsync(int id);
    }
}
