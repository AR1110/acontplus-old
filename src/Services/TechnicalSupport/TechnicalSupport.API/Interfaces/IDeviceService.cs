using Common.Core.Models;
using TechnicalSupport.API.Entities;

namespace TechnicalSupport.API.Interfaces
{
    public interface IDeviceService
    {
        public Task<ApiResponse> AddAsync(Device device);
        public Task<ApiResponse> DeleteAsync(int id, int userId);
        public Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
        public Task<ApiResponse> UpdateAsync(int id, Device device);
    }
}
