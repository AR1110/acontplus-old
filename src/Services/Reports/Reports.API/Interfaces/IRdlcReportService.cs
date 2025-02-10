using Reports.API.Models;

namespace Reports.API.Interfaces
{
    public interface IRdlcReportService
    {
        public ReportResponse GetReport(DataSet parameters, DataSet data, bool offline = false);
        public Task<ReportResponse> GetErrorAsync();
    }
}
