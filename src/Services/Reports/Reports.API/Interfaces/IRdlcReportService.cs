using System.Data;
using Reports.API.Models;

namespace Reports.API.Interfaces
{
    public interface IRdlcReportService
    {
        public byte[] GetCustomReport(DataSet dsParams, DataSet ds);
        public ReportResponse GetDynamicReport(DataSet dataSet);
        public Task<ReportResponse> GetErrorAsync();
    }
}
