using System.Data;
using Domain.Dtos;
using Lib.Common;
using Microsoft.Extensions.Configuration;
using Microsoft.Reporting.NETCore;
using Newtonsoft.Json;

namespace Reports.Application
{
    public sealed class ReportService
    {
        private readonly IConfiguration _configuration;
        public ReportService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public byte[] ByteReport(DataSet dsParams, DataSet ds, bool fromService = false)
        {
            using (LocalReport lr = new LocalReport())
            {
                if (dsParams.Tables[0].Rows.Count == 0)
                    return null;

                string mainPath = Directory.GetCurrentDirectory() + "\\Reports\\";

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
                    //Recorremos los parametros del reporte como logos, textos, etc
                    //ReportParameter[] p = new ReportParameter[dsParams.Tables[2].Rows.Count];
                    //foreach (DataRow row in dsParams.Tables[2].Rows)
                    //{
                    //    if (Convert.ToBoolean(row["isByte"]))
                    //    {
                    //        p[Convert.ToInt32(row["position"])] = new ReportParameter(row["paramName"].ToString(), FileExtensions.GetBase64FromByte((byte[])row["paramByte"]));
                    //    }
                    //    else
                    //    {
                    //        p[Convert.ToInt32(row["position"])] = new ReportParameter(row["paramName"].ToString(), row["paramValue"].ToString());
                    //    }
                    //}
                    //lr.SetParameters(p);
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
        public byte[] ByteReportDynamic(dynamic data, ref string mimeType, ref string fileName)
        {
            ApiReportParamsDto parameters = RdlcHelpers.ConverToModelReportParams(data);
            string format = "", mimeTypeImg = "";
            using (LocalReport lr = new LocalReport())
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
                        string path = Directory.GetCurrentDirectory() + "\\Reports\\" + item.Value.ToString();
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
                        lr.DataSources.Add(new ReportDataSource(item.Key, JsonToDataTable(JsonConvert.SerializeObject(item.Value))));
                    }
                }

                //Recorremos los parametros del reporte como logos, textos, etc
                foreach (var item in parameters.rdlcParams)
                {
                    if (item.Key == "imagen")
                    {
                        byte[] array = Convert.FromBase64String(item.Value);
                        lr.SetParameters(new ReportParameter("logo", FileExtensions.GetBase64FromByte((byte[])array)));
                        lr.SetParameters(new ReportParameter("mimeType", mimeTypeImg));
                    }
                    //if (item.Key == "mimeType")
                    //{                        
                    //    lr.SetParameters(new ReportParameter(item.Key, item.Value));
                    //}
                    if (item.Key == "claveAcceso")
                    {
                        lr.SetParameters(new ReportParameter("barcode", Convert.ToBase64String(BarcodeGen.Create(item.Value), 0, BarcodeGen.Create(item.Value).Length)));
                        lr.SetParameters(new ReportParameter("mimeTypeBarcode", "image/png"));
                    }
                }
                return lr.Render(format, null, out mimeType, out _, out _, out _, out _);
            }
        }
        public static DataTable JsonToDataTable(string json)
        {
            DataTable dt = (DataTable)JsonConvert.DeserializeObject(json, (typeof(DataTable)));
            return dt;
        }
    }
}
