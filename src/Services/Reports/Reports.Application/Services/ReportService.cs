using System.Data;
using Common.Core.Interfaces;
using Reports.Core.Interfaces;

namespace Reports.Application.Services
{
    public class ReportService(IAdoSqlServer repository) : IReportService
    {
        private readonly IAdoSqlServer _repository = repository ?? throw new ArgumentNullException(nameof(repository));

        public async Task<DataSet> GetParamsAsync(Dictionary<string, object> parameters)
        {
            return await _repository.GetDataSetAsync("Reporte.Report_Get", parameters);
        }
        public async Task<DataSet> GetDataAsync(string spname, Dictionary<string, object> parameters, bool legacy)
        {
            return await _repository.GetDataSetAsync(spname, parameters, legacy, false);
        }
    }
}
