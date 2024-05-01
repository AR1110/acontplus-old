using Common.Core.Models;

namespace Mechanical.API.Interfaces
{
    public interface IVehicleService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<string> AddAsync(Dictionary<string, object> parameters);
        Task<string> UpdateAsync(Dictionary<string, object> parameters);
        Task<ApiResponse> DeleteAsync(int id);
        Task<ApiResponse> UpdateStateAsync(int id, bool state);

    }
}
