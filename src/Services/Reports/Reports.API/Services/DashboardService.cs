using Common.Core.Interfaces;
using Common.Core.Utils;
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
        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Dashboard.Estadisticas_Get", parameters, true);
            if (ds.Tables[0].Rows.Count == 0)
            {
                return null;
            }
            return DataConverters.DataSetToJSON(ds);
        }
    }
}
