using Common.Core.Models;
using TechnicalSupport.API.Entities;

namespace TechnicalSupport.API.Interfaces
{
    public interface IDeviceSpecService
    {
        public Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
        public Task<ApiResponse> AddAsync(DeviceSpecs data);
        public Task<ApiResponse> UpdateAsync(int id, DeviceSpecs data);
    }
}
