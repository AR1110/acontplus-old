using System.Data;
using System.Text;
using System.Web;
using Common.Core.Utils;
using Microsoft.Extensions.Configuration;
using Microsoft.Reporting.NETCore;
using Reports.Core.Enums;
using Reports.Core.Interfaces;
using Reports.Core.Models;

namespace Reports.Application.Services
{
    public class RdlcReportService : IRdlcReportService
    {
        private readonly IConfiguration _configuration;
        public RdlcReportService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public ReportResponse GetReport(DataSet dsParams, DataSet ds, bool offline = false)
        {
            var response = new ReportResponse();
            var reportProps = DataTableMapper.BindData<ReportProps>(dsParams.Tables["ReportProps"]);
            using (var lr = new LocalReport())
            {
                if (offline)
                {
                    lr.LoadReportDefinition(RdlcHelpers.LoadReportDefinition(_configuration.GetSection("dirReports").Value + dsParams.Tables[0].Rows[0]["reportPath"].ToString()));
                }
                else
                {
                    var mainPath = Directory.GetCurrentDirectory() + "\\Reports\\";
                    var paths = reportProps.ReportPath.Split("/");
                    paths = paths.Where(s => !string.IsNullOrEmpty(s)).ToArray();

                    switch (paths.Length)
                    {
                        case 1:
                            lr.LoadReportDefinition(RdlcHelpers.LoadReportDefinition(Path.Combine(mainPath, paths[0])));
                            break;
                        case 2:
                            lr.LoadReportDefinition(RdlcHelpers.LoadReportDefinition(Path.Combine(mainPath, paths[0], paths[1])));
                            break;
                        default:
                            lr.LoadReportDefinition(RdlcHelpers.LoadReportDefinition(mainPath + reportProps.ReportPath));
                            break;
                    }
                }
                if (dsParams.Tables.Contains("DataSources"))
                {
                    //Recorremos los datatables con sus respectivas posiciones,para llenar la información
                    var dataSources = dsParams.Tables["DataSources"];
                    foreach (DataRow row in dataSources.Rows)
                    {
                        lr.DataSources.Add(new ReportDataSource(row["dataSource"].ToString(), ds.Tables[row.Field<int>("position")]));
                    }
                }
                else
                {
                    var dataSourceNames = lr.GetDataSourceNames();
                    foreach (var dataSourceName in dataSourceNames)
                    {
                        lr.DataSources.Add(new ReportDataSource(dataSourceName, ds.Tables[dataSourceName]));
                    }
                }

                //Recorremos los parametros del reporte como logos, textos, etc
                var firstDataSource = ds.Tables[0];
                if (firstDataSource.Columns.Contains("codigoAutorizacion"))
                {
                    var byteBarcode = BarcodeGen.Create(firstDataSource.Rows[0].Field<string>("codigoAutorizacion"));
                    lr.SetParameters(new ReportParameter("barcode", Convert.ToBase64String(
                        byteBarcode,
                        0,
                        byteBarcode.Length)));
                    lr.SetParameters(new ReportParameter("mimeTypeBarcode", "image/png"));
                }

                if (dsParams.Tables.Contains("ReportParams") && dsParams.Tables["ReportParams"].Rows.Count > 0)
                {
                    foreach (DataRow item in dsParams.Tables["ReportParams"].Rows)
                    {
                        string paramValue = "";
                        if (Convert.ToBoolean(item["isPicture"]))
                        {
                            if (item.Field<bool>("isCompressed"))
                            {
                                paramValue = FileExtensions.GetBase64FromByte(CompressionHelper.Decompress((byte[])item["paramValue"]));
                            }
                            else
                            {
                                paramValue = FileExtensions.GetBase64FromByte((byte[])item["paramValue"]);
                            }
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
                Enum.TryParse(reportProps.ReportFormat.ToUpper(), out FileFormats.FileContentType fc);
                Enum.TryParse(reportProps.ReportFormat.ToUpper(), out FileFormats.FileExtension fe);
                response.FileContents = fileReport;
                response.ContentType = EnumExtensions.DisplayName(fc);
                response.FileDownloadName = HttpUtility.UrlEncode(reportProps.ReportName + EnumExtensions.DisplayName(fe), Encoding.UTF8);
                return response;
                //return new ReportResponse { FileContents = fileReport, ContentType = EnumExtensions.DisplayName(fc), FileDownloadName = HttpUtility.UrlEncode(reportProps.ReportName + EnumExtensions.DisplayName(fe), Encoding.UTF8) };
            }
        }
        public async Task<ReportResponse> GetErrorAsync()
        {
            return new ReportResponse { FileContents = await File.ReadAllBytesAsync(Path.Combine(Directory.GetCurrentDirectory(), "Reports", "NotFound.pdf")), ContentType = "application/pdf", FileDownloadName = "Not Found.pdf" };
        }
    }
}
