using Common.Core.Interfaces;
using Reports.API.Interfaces;

namespace Reports.API.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IADORepository _repository;
        public DashboardService(IADORepository repository)
        {
            _repository = repository;
        }
        public async Task<string> GetAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("Dashboard.Estadisticas_Get", parameters);
        }
    }
}
