using System.Data;
using Common.Core.Models;

namespace Common.Core.Interfaces
{
    public interface IReportService
    {
        public byte[] GetReport(DataSet dsParams, DataSet ds, bool fromService = false);
        public byte[] GetDynamicReport(dynamic data, ref string mimeType, ref string fileName);
        public ReportResponse GetReportNew(DataSet dataSet);
        public Task<ReportResponse> GetErrorAsync();
    }
}
