using Lib.Common.Api;

namespace Restaurant.Core.Interfaces
{
    public interface IOrderService
    {
        Task<string> GetAsync(Dictionary<string, object> parameters);
        Task<string> PrintAsync(Dictionary<string, object> parameters);
        Task<string> AddAsync(ApiRequest data);
    }
}
