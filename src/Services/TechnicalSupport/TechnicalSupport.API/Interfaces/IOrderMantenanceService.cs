using Common.Core.Models;

namespace TechnicalSupport.API.Interfaces
{
    public interface IOrderMantenanceService
    {
        Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> AddAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> DeleteAsync(int id);
    }
}
