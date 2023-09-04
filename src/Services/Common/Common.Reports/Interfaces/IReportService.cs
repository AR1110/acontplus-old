using System.Data;
using Lib.Common.Dtos;

namespace Common.Reports.Interfaces
{
    public interface IReportService
    {
        public byte[] GetReport(DataSet dsParams, DataSet ds, bool fromService = false);
        public byte[] GetDynamicReport(dynamic data, ref string mimeType, ref string fileName);
        public ReportResponseDto GetReportNew(DataSet dataSet);
    }
}
