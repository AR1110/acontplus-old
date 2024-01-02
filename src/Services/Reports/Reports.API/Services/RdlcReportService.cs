using System.Data;
using System.Text;
using System.Web;
using Common.Core.Utils;
using Microsoft.Reporting.NETCore;
using Reports.API.Enums;
using Reports.API.Interfaces;
using Reports.API.Models;

namespace Reports.API.Services
{
    public class RdlcReportService : IRdlcReportService
    {
        public ReportResponse GetReport(DataSet dsParams, DataSet ds)
        {
            var reportProps = new ReportProps();
            reportProps = DataTableMapper.BindData<ReportProps>(dsParams.Tables["ReportProps"]);
            using (var lr = new LocalReport())
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
                if (dsParams.Tables.Contains("DataSources"))
                {
                    //Recorremos los datatbles con sus respectivas posiciones,para llenar la información
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
                    lr.SetParameters(new ReportParameter("barcode", Convert.ToBase64String(BarcodeGen.Create(firstDataSource.Rows[0].Field<string>("codigoAutorizacion")), 0, BarcodeGen.Create(firstDataSource.Rows[0].Field<string>("codigoAutorizacion")).Length)));
                    lr.SetParameters(new ReportParameter("mimeTypeBarcode", "image/png"));
                }

                if (dsParams.Tables.Contains("ReportParams"))
                {
                    var rdlcParams = dsParams.Tables["ReportParams"];
                    //Recorremos los parametros del reporte como logos, textos, etc
                    if (rdlcParams.Rows.Count > 0)
                    { 
                        //ReportParameterInfoCollection parameters = lr.GetParameters(); 
                        foreach (DataRow item in rdlcParams.Rows)
                        {
                            var paramValue = "";
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
                }

                //return lr.Render(format, null, out _, out _, out _, out _, out _);
                byte[] fileReport = lr.Render(reportProps.ReportFormat, null, out _, out _, out _, out _, out _);
                Enum.TryParse(reportProps.ReportFormat, out FileFormats.FileContentType fc);
                Enum.TryParse(reportProps.ReportFormat, out FileFormats.FileExtension fe);
                return new ReportResponse { FileContents = fileReport, ContentType = EnumExtensions.DisplayName(fc), FileDownloadName = HttpUtility.UrlEncode(reportProps.ReportName + EnumExtensions.DisplayName(fe), Encoding.UTF8) };
            }
        }
        public async Task<ReportResponse> GetErrorAsync()
        {
            var errorFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Reports", "NotFound.pdf");
            var bytes = await File.ReadAllBytesAsync(errorFilePath);
            return new ReportResponse { FileContents = bytes, ContentType = "application/pdf", FileDownloadName = "Not Found.pdf" };
        }
    }
}
