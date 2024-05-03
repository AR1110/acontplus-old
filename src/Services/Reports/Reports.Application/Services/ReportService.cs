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
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        }

        public async Task<DataSet> GetParamsAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Reporte.Report_Get", parameters).ConfigureAwait(false);
            return ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0 ? ds : null;
        }

        public async Task<DataSet> GetDataAsync(string spname, Dictionary<string, object> parameters, bool legacy)
        {
            var ds = await _repository.GetDataSetAsync(spname, parameters, legacy).ConfigureAwait(false);
            return ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0 ? ds : null;
        }
    }
}
