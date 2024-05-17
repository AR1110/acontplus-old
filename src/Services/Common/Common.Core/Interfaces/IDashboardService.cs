using Common.Core.Models;

namespace Common.Core.Interfaces
{
    public interface IDashboardService
    {
        Task<ApiResponse> GetAsync(Dictionary<string, object> parameters);
    }
}
