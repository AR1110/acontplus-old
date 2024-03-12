using System.Data;
using Common.Core.Interfaces;
using Reports.Core.Interfaces;

namespace Reports.Application.Services
{
    public class ReportService : IReportService
    {
        private readonly IADOSqlServer _repository;
        public ReportService(IADOSqlServer repository)
        {
            _repository = repository;
        }
        public async Task<DataSet> GetParamsAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Reporte.Report_Get", parameters);
            if (ds.Tables[0].Rows.Count == 0 || ds == null)
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
