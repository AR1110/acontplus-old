using Common.Core.Models;
using TechnicalSupport.API.Entities;
using TechnicalSupport.API.Interfaces;

namespace TechnicalSupport.API.Services
{
    public class DeviceSpecService : IDeviceSpecService
    {
        public Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            throw new NotImplementedException();
        }

        public Task<ApiResponse> AddAsync(DeviceSpecs data)
        {
            throw new NotImplementedException();
        }

        public Task<ApiResponse> UpdateAsync(int id, DeviceSpecs data)
        {
            throw new NotImplementedException();
        }
    }
}
