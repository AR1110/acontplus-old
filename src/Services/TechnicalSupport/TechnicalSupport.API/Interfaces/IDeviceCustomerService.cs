using Common.Core.Models;

namespace TechnicalSupport.API.Interfaces
{
    public interface IDeviceCustomerService
    {
        public Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    }
}
