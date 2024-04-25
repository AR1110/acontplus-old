using Common.Core.Models;

namespace TechnicalSupport.API.Interfaces
{
    public interface IStatsService
    {
        Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    }
}
