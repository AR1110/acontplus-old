using System.Data;
using Reports.API.Models;

namespace Reports.API.Interfaces
{
    public interface IRdlcReportService
    {
        public ReportResponse GetReport(DataSet dsParams, DataSet ds);
        public Task<ReportResponse> GetErrorAsync();
    }
}
