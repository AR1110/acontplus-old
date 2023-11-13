using Common.Core.Models;

namespace Restaurant.Core.Interfaces
{
    public interface IOrderService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<string> AddAsync(ApiRequest data);
        Task<string> PutAsync(int id, ApiRequest data);
        Task<bool> DeleteAsync(int id);
        Task<string> PrintAsync(Dictionary<string, object> parameters);
        Task<ReportResponse> GetReportAsync(Dictionary<string, object> parameters);
    }
}
