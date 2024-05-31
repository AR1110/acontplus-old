using Common.Core.Interfaces;
using Common.Core.Models;

namespace Common.Application.Services
{
    public class DashboardService(IAdoRepository repository) : IDashboardService
    {
        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            return await repository.SpExecuteAsync("Common.Dashboard_Get", parameters);
        }
    }
}
