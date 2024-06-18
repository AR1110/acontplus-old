using System.Data;
using Reports.Application.Models;

namespace Reports.Application.Interfaces
{
    public interface IRdlcReportService
    {
        public ReportResponse GetReport(DataSet parameters, DataSet data, bool offline = false);
        public Task<ReportResponse> GetErrorAsync();
    }
}
