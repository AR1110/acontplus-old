using Lib.Common.Api;

namespace Restaurant.Core.Interfaces
{
    public interface IOrderService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<string> PrintAsync(Dictionary<string, object> parameters);
        Task<object> ConvertToDocAsync(Dictionary<string, object> parameters);
        Task<string> AddAsync(ApiRequest data);
        Task<string> PutAsync(int id, ApiRequest data);
    }
}
