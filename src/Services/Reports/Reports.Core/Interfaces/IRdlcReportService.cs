using System.Data;
using Reports.Core.Models;

namespace Reports.Core.Interfaces
{
    public interface IRdlcReportService
    {
        public ReportResponse GetReport(DataSet dsParams, DataSet ds, bool offline = false);
        public Task<ReportResponse> GetErrorAsync();
    }
}
