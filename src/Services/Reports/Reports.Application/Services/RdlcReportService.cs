using System.Data;
using System.Text;
using System.Web;
using Common.Core.Utils;
using Microsoft.Extensions.Configuration;
using Microsoft.Reporting.NETCore;
using Reports.Core.Enums;
using Reports.Core.Interfaces;
using Reports.Core.Models;
using static System.Enum;

namespace Reports.Application.Services
{
    public class RdlcReportService(IConfiguration configuration) : IRdlcReportService
    {
        public ReportResponse GetReport(DataSet parameters, DataSet data, bool offline = false)
        {
            var response = new ReportResponse();
            var reportProps = DataTableMapper.BindData<ReportProps>(parameters.Tables["ReportProps"]);

            using var lr = new LocalReport();
            if (offline)
            {
                var value = configuration.GetSection("dirReports").Value;
                if (value != null)
                {
                    var reportPath = Path.Combine(value, parameters.Tables[0].Rows[0]["reportPath"].ToString());
                    lr.LoadReportDefinition(RdlcHelpers.LoadReportDefinition(reportPath));
                }
            }
            else
            {
                var mainPath = Path.Combine(Directory.GetCurrentDirectory(), "Reports");
                var paths = reportProps.ReportPath.Split("/");
                paths = paths.Where(s => !string.IsNullOrEmpty(s)).ToArray();

                switch (paths.Length)
                {
                    case 1:
                        lr.LoadReportDefinition(RdlcHelpers.LoadReportDefinition(Path.Combine(mainPath, paths[0])));
                        break;
                    case 2:
                        lr.LoadReportDefinition(
                            RdlcHelpers.LoadReportDefinition(Path.Combine(mainPath, paths[0], paths[1])));
                        break;
                    default:
                        lr.LoadReportDefinition(
                            RdlcHelpers.LoadReportDefinition(Path.Combine(mainPath, reportProps.ReportPath)));
                        break;
                }
            }

            if (parameters.Tables.Contains("DataSources"))
            {
                var dataSources = parameters.Tables["DataSources"];
                if (dataSources != null)
                {
                    foreach (DataRow row in dataSources.Rows)
                    {
                        lr.DataSources.Add(new ReportDataSource(row["dataSource"].ToString(),
                            data.Tables[row.Field<int>("position")]));
                    }
                }
            }
            else
            {
                var dataSourceNames = lr.GetDataSourceNames();
                foreach (var dataSourceName in dataSourceNames)
                {
                    lr.DataSources.Add(new ReportDataSource(dataSourceName, data.Tables[dataSourceName]));
                }
            }

            var firstDataSource = data.Tables[0];
            if (firstDataSource.Columns.Contains("codigoAutorizacion"))
            {
                var byteBarcode = BarcodeGen.Create(firstDataSource.Rows[0].Field<string>("codigoAutorizacion"));
                lr.SetParameters(new ReportParameter("barcode", Convert.ToBase64String(
                    byteBarcode,
                    0,
                    byteBarcode.Length)));
                lr.SetParameters(new ReportParameter("mimeTypeBarcode", "image/png"));
            }

            if (parameters.Tables.Contains("ReportParams") && parameters.Tables["ReportParams"]!.Rows.Count > 0)
            {
                foreach (DataRow item in parameters.Tables["ReportParams"].Rows)
                {
                    string paramValue = "";
                    if (Convert.ToBoolean(item["isPicture"]))
                    {
                        paramValue = item.Field<bool>("isCompressed")
                            ? FileExtensions.GetBase64FromByte(CompressionHelper.Decompress((byte[])item["paramValue"]))
                            : FileExtensions.GetBase64FromByte((byte[])item["paramValue"]);
                        lr.SetParameters(new ReportParameter(item["paramName"].ToString(), paramValue));
                    }
                    else
                    {
                        paramValue = Encoding.UTF8.GetString(item.Field<byte[]>("paramValue"));
                        lr.SetParameters(new ReportParameter(item.Field<string>("paramName"), paramValue));
                    }
                }
            }

            byte[] fileReport = lr.Render(reportProps.ReportFormat, null, out _, out _, out _, out _, out _);
            TryParse(reportProps.ReportFormat.ToUpper(), out FileFormats.FileContentType fc);
            TryParse(reportProps.ReportFormat.ToUpper(), out FileFormats.FileExtension fe);
            response.FileContents = fileReport;
            response.ContentType = fc.DisplayName();
            response.FileDownloadName = HttpUtility.UrlEncode(reportProps.ReportName + fe.DisplayName(), Encoding.UTF8);
            return response;
        }

        public async Task<ReportResponse> GetErrorAsync()
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Reports", "NotFound.pdf");
            var fileContents = await File.ReadAllBytesAsync(filePath);
            return new ReportResponse
            {
                FileContents = fileContents, ContentType = "application/pdf", FileDownloadName = "Not Found.pdf"
            };
        }
    }
}
