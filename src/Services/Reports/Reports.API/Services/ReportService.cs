using System.Data;
using Common.Core.Interfaces;
using Reports.API.Interfaces;

namespace Reports.API.Services
{
    public class ReportService : IReportService
    {
        private readonly IADORepository _repository;
        public ReportService(IADORepository repository)
        {
            _repository = repository;
        }
        public async Task<DataSet> GetParamsAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Reporte.Report_Get", parameters, true);
            if (ds.Tables[0].Rows.Count == 0)
            {
                return null;
            }
            return ds;
        }
        public async Task<DataSet> GetDataAsync(string spname, Dictionary<string, object> parameters, bool legacy)
        {
            var ds = await _repository.GetDataSetAsync(spname, parameters, legacy);
            if (ds.Tables[0].Rows.Count == 0)
            {
                return null;
            }
            return ds;
        }
    }
}
