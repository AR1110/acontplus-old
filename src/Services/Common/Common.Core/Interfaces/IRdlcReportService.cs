using System.Data;
using Common.Core.Models;

namespace Common.Core.Interfaces
{
    public interface IRdlcReportService
    {
        public byte[] GetCustomReport(DataSet dsParams, DataSet ds);
        public ReportResponse GetDynamicReport(DataSet dataSet);
        public Task<ReportResponse> GetErrorAsync();
    }
}
