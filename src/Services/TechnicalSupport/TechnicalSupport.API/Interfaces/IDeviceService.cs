using Common.Core.Models;

namespace TechnicalSupport.API.Interfaces
{
    public interface IDeviceService
    {
        public Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    }
}
