using System.Data;
using System.Text;
using Common.Reports.Enums;
using Common.Reports.Interfaces;
using Lib.Common;
using Lib.Common.Dtos;
using Lib.Common.Utils;
using Microsoft.Extensions.Configuration;
using Microsoft.Reporting.NETCore;
using Newtonsoft.Json;

namespace Common.Reports.Services
{
    public class ReportService : IReportService
    {
        private readonly IConfiguration _configuration;
        public ReportService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public byte[] GetReport(DataSet dsParams, DataSet ds, bool fromService = false)
        {
            using (var lr = new LocalReport())
            {
                if (dsParams.Tables[0].Rows.Count == 0)
                    return null;

                var mainPath = Directory.GetCurrentDirectory() + "\\Reports\\";

                if (ds.Tables[0].Rows.Count > 0)
                {
                    if (fromService)
                    {
                        //lr.ReportPath = _configuration.GetSection("dirReports").Value + dsParams.Tables[0].Rows[0]["reportPath"].ToString();
                        lr.LoadReportDefinition(RdlcHelpers.LoadReportDefinition(_configuration.GetSection("dirReports").Value + dsParams.Tables[0].Rows[0]["reportPath"].ToString()));
                    }
                    else
                    {
                        //lr.ReportPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, dsParams.Tables[0].Rows[0]["reportPath"].ToString());
                        var paths = dsParams.Tables[0].Rows[0].Field<string>("reportPath").Split("/");
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
                                lr.LoadReportDefinition(RdlcHelpers.LoadReportDefinition(mainPath + dsParams.Tables[0].Rows[0].Field<string>("reportPath")));
                                break;
                        }
                    }
                }
                else
                {
                    return null;
                }
                //Recorremos los datatbles con sus respectivas posiciones,para llenar la información
                foreach (DataRow row in dsParams.Tables[1].Rows)
                {
                    lr.DataSources.Add(new ReportDataSource(row["dataSource"].ToString(), ds.Tables[Convert.ToInt32(row["position"])]));
                }
                //Recorremos los parametros del reporte como logos, textos, etc
                if (Convert.ToBoolean(dsParams.Tables[0].Rows[0]["hasParams"]))
                {
                    if (ds.Tables[0].Columns.Contains("codigoAutorizacion"))
                    {
                        lr.SetParameters(new ReportParameter("barcode", Convert.ToBase64String(BarcodeGen.Create(ds.Tables[0].Rows[0]["codigoAutorizacion"].ToString()), 0, BarcodeGen.Create(ds.Tables[0].Rows[0]["codigoAutorizacion"].ToString()).Length)));
                        lr.SetParameters(new ReportParameter("mimeTypeBarcode", "image/png"));
                    }
                    //Recorremos los parametros del reporte como logos, textos, etc
                    if (dsParams.Tables[2].Rows.Count > 0)
                    {
                        foreach (DataRow item in dsParams.Tables[2].Rows)
                        {
                            if (Convert.ToBoolean(item["isByte"]))
                            {
                                lr.SetParameters(new[] { new ReportParameter(item["paramName"].ToString(), FileExtensions.GetBase64FromByte((byte[])item["paramByte"])) });
                            }
                            else
                            {
                                lr.SetParameters(new[] { new ReportParameter(item["paramName"].ToString(), item["paramValue"].ToString()) });
                            }
                        }
                    }
                }

                return lr.Render(dsParams.Tables[0].Rows[0]["format"].ToString(), null, out _, out _, out _, out _, out _);
            }
        }
        public byte[] GetDynamicReport(dynamic data, ref string mimeType, ref string fileName)
        {
            ApiReportParamsDto parameters = RdlcHelpers.ConverToModelReportParams(data);
            string format = "", mimeTypeImg = "";
            using (var lr = new LocalReport())
            {
                foreach (var item in parameters.rdlcParams)
                {
                    if (item.Key == "reportPath")
                    {
                        //lr.ReportPath = _configuration.GetSection("dirReports").Value + item.Value.ToString();
                        //var paths = item.Value.ToString().Split("/");
                        //paths = paths.Where(s => !string.IsNullOrEmpty(s)).ToArray();

                        //switch (paths.Length)
                        //{
                        //    case 1:
                        //        lr.LoadReportDefinition(RdlcHelpers.LoadReportDefinition(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports", paths[0])));
                        //        break;
                        //    case 2:
                        //        lr.LoadReportDefinition(RdlcHelpers.LoadReportDefinition(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports", paths[0], paths[1])));
                        //        break;
                        //    default:
                        //        lr.LoadReportDefinition(RdlcHelpers.LoadReportDefinition(_configuration.GetSection("dirReports").Value + item.Value.ToString()));
                        //        break;
                        //}
                        var path = Directory.GetCurrentDirectory() + "\\Reports\\" + item.Value.ToString();
                        lr.LoadReportDefinition(RdlcHelpers.LoadReportDefinition(path));
                    }
                    if (item.Key == "format")
                    {
                        format = item.Value;
                    }
                    if (item.Key == "fileName")
                    {
                        fileName = item.Value;
                    }
                    if (item.Key == "mimeType")
                    {
                        mimeTypeImg = item.Value;
                    }
                }
                if (parameters.dataSources != null)
                {
                    foreach (var item in parameters.dataSources)
                    {
                        lr.DataSources.Add(new ReportDataSource(item.Key, Converters.JsonToDataTable(JsonConvert.SerializeObject(item.Value))));
                    }
                }

                //Recorremos los parametros del reporte como logos, textos, etc
                foreach (var item in parameters.rdlcParams)
                {
                    if (item.Key == "imagen")
                    {
                        var array = Convert.FromBase64String(item.Value);
                        lr.SetParameters(new ReportParameter("logo", FileExtensions.GetBase64FromByte(array)));
                        lr.SetParameters(new ReportParameter("mimeType", mimeTypeImg));
                    }
                    if (item.Key == "claveAcceso")
                    {
                        lr.SetParameters(new ReportParameter("barcode", Convert.ToBase64String(BarcodeGen.Create(item.Value), 0, BarcodeGen.Create(item.Value).Length)));
                        lr.SetParameters(new ReportParameter("mimeTypeBarcode", "image/png"));
                    }
                }
                return lr.Render(format, null, out mimeType, out _, out _, out _, out _);
            }
        }
        public ReportResponseDto GetReportNew(DataSet ds)
        {
            if (!ds.Tables.Contains("RdlcProps") | !ds.Tables.Contains("RdlcDataSources"))
            {
                return null;
            }

            if (ds.Tables["RdlcProps"].Rows.Count == 0 | ds.Tables["RdlcDataSources"].Rows.Count == 0)
            {
                return null;
            }

            using (LocalReport lr = new LocalReport())
            {
                var rdlcProps = DataTableMapper.BindData<RdlcPropsDto>(ds.Tables["RdlcProps"]);
                string path = Path.Combine(Directory.GetCurrentDirectory(), rdlcProps.ReportPath);
                lr.ReportPath = path;

                foreach (DataRow item in ds.Tables["RdlcDataSources"].Rows)
                {
                    lr.DataSources.Add(new ReportDataSource(item.Field<string>("dsName"), ds.Tables[item.Field<string>("dsName")]));
                }

                if (ds.Tables.Contains("RdlcParams") && ds.Tables["RdlcParams"].Rows.Count > 0)
                {
                    foreach (DataRow item in ds.Tables["RdlcParams"].Rows)
                    {
                        if (Convert.ToBoolean(item.Field<bool>("isBase64")))
                        {
                            lr.SetParameters(new[] { new ReportParameter(item.Field<string>("paramName"), FileExtensions.GetBase64FromByte(item.Field<byte[]>("paramValue"))) });
                        }
                        else
                        {
                            var paramValue = Encoding.UTF8.GetString(item.Field<byte[]>("paramValue"));
                            lr.SetParameters(new[] { new ReportParameter(item.Field<string>("paramName"), paramValue) });
                        }
                    }
                }
                byte[] fileReport = lr.Render(rdlcProps.ReportFormat, null, out _, out _, out _, out _, out _);
                Enum.TryParse(rdlcProps.ReportFormat, out FileFormats.FileContentType fc);
                Enum.TryParse(rdlcProps.ReportFormat, out FileFormats.FileExtension fe);
                return new ReportResponseDto { FileContents = fileReport, ContentType = EnumExtensions.DisplayName(fc), FileDownloadName = rdlcProps.ReportName + EnumExtensions.DisplayName(fe) };
            }
        }
        public async Task<ReportResponseDto> GetErrorAsync()
        {
            string errorFilePath = Path.Combine(Directory.GetCurrentDirectory(), "Reports", "NotFound.pdf");
            byte[] bytes = await File.ReadAllBytesAsync(errorFilePath);
            return new ReportResponseDto { FileContents = bytes, ContentType = "application/pdf", FileDownloadName = "Not Found.pdf" };
        }
    }
}
