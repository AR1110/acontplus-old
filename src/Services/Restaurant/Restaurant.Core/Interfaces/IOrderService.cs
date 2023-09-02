using Lib.Common.Api;
using Lib.Common.Dtos;

namespace Restaurant.Core.Interfaces
{
    public interface IOrderService
    {
        Task<object> GetAsync(Dictionary<string, object> parameters);
        Task<string> AddAsync(ApiRequest data);
        Task<string> PutAsync(int id, ApiRequest data);
        Task<string> PrintAsync(Dictionary<string, object> parameters);
        Task<ReportResponseDto> GetReportAsync(Dictionary<string, object> parameters);
    }
}
