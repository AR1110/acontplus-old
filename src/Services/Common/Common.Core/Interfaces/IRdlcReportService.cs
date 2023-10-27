using System.Data;
using Common.Core.Models;

namespace Common.Core.Interfaces
{
    public interface IRdlcReportService
    {
        public byte[] GetCustomReport(DataSet dsParams, DataSet ds, bool fromService = false);
        public ReportResponse GetDynamicReport(DataSet dataSet);
        public Task<ReportResponse> GetErrorAsync();
    }
}
