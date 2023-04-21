using Common.Logs;
using Domain.Config.Dtos;
using Domain.Dtos;
using Helpers;
using Microsoft.Extensions.Configuration;
using Microsoft.Reporting.NETCore;
using Newtonsoft.Json;
using System.Data;
using System.Diagnostics;
using System.Drawing.Imaging;
using System.Drawing.Printing;

namespace BL.Reports
{
    public sealed class Reports
    {
        private readonly IConfiguration _configuration;
        public Reports(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public byte[] ByteReport(DataSet dsParams, DataSet ds, bool fromService = false)
        {
            using (LocalReport lr = new LocalReport())
            {
                if (dsParams.Tables[0].Rows.Count == 0)
                    return null;

                if (ds.Tables[0].Rows.Count > 0)
                {
                    if (fromService)
                    {
                        //lr.ReportPath = _configuration.GetSection("dirReports").Value + dsParams.Tables[0].Rows[0]["reportPath"].ToString();
                        lr.LoadReportDefinition(RdlcLoad.LoadReportDefinition(_configuration.GetSection("dirReports").Value + dsParams.Tables[0].Rows[0]["reportPath"].ToString()));
                    }
                    else
                    {
                        //lr.ReportPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, dsParams.Tables[0].Rows[0]["reportPath"].ToString());
                        var paths = dsParams.Tables[0].Rows[0].Field<string>("reportPath").Split("/");
                        paths = paths.Where(s => !string.IsNullOrEmpty(s)).ToArray();

                        switch (paths.Length)
                        {
                            case 1:
                                lr.LoadReportDefinition(RdlcLoad.LoadReportDefinition(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports", paths[0])));
                                break; 
                                case 2:
                                lr.LoadReportDefinition(RdlcLoad.LoadReportDefinition(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports", paths[0], paths[1])));
                                break;
                            default:
                                lr.LoadReportDefinition(RdlcLoad.LoadReportDefinition(_configuration.GetSection("dirReports").Value + dsParams.Tables[0].Rows[0].Field<string>("reportPath")));
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

        public byte[] ByteReportDynamic(ApiReportParamsDto parameters, ref string mimeType, ref string fileName)
        {
            string format = "";
            string mimeTypeImg = "";
            using (LocalReport lr = new LocalReport())
            {
                foreach (var item in parameters.rdlcParams)
                {
                    if (item.Key == "reportPath")
                    {
                        //lr.ReportPath = _configuration.GetSection("dirReports").Value + item.Value.ToString();
                        var paths = item.Value.ToString().Split("/");
                        paths = paths.Where(s => !string.IsNullOrEmpty(s)).ToArray();

                        switch (paths.Length)
                        {
                            case 1:
                                lr.LoadReportDefinition(RdlcLoad.LoadReportDefinition(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports", paths[0])));
                                break;
                            case 2:
                                lr.LoadReportDefinition(RdlcLoad.LoadReportDefinition(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports", paths[0], paths[1])));
                                break;
                            default:
                                lr.LoadReportDefinition(RdlcLoad.LoadReportDefinition(_configuration.GetSection("dirReports").Value + item.Value.ToString()));
                                break;
                        }
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
                        lr.DataSources.Add(new ReportDataSource(item.Key, DataHelper.JsonToDataTable(JsonConvert.SerializeObject(item.Value))));
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
        public static bool DynamicPrint(ApiPrintRequestDto parameters, string printerName)
        {
            var streams = new List<Stream>();
            try
            {

                using (LocalReport lr = new LocalReport())
                {
                    string format = string.Empty;
                    string deviceInfo = string.Empty;
                    foreach (var props in parameters.rdlcProps)
                    {
                        foreach (var item in props)
                        {
                            if (item.Key == "rdlcName")
                            {
                                //lr.ReportPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports", item.Value);
                                lr.LoadReportDefinition(RdlcLoad.LoadReportDefinition(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports", item.Value)));
                            }
                            if (item.Key == "formato")
                            {
                                format = item.Value;
                            }
                            if (item.Key == "deviceInfo")
                            {
                                deviceInfo = item.Value;
                            }
                        }
                    }
                    if (parameters.dataSources != null)
                    {
                        foreach (var item in parameters.dataSources)
                        {
                            lr.DataSources.Add(new ReportDataSource(item.Key, DataHelper.JsonToDataTable(JsonConvert.SerializeObject(item.Value))));
                        }
                    }

                    if (parameters.rdlcParams != null)
                    {
                        foreach (var item in parameters.rdlcParams)
                        {
                            if (item.Key == "logo")
                            {
                                string dirlogo = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logos", item.Value);
                                lr.SetParameters(new ReportParameter(item.Key, Convert.ToBase64String(File.ReadAllBytes(dirlogo))));
                            }
                            else
                            {
                                lr.SetParameters(new ReportParameter(item.Key, item.Value));
                            }
                        }
                    }

                    lr.Render(format, deviceInfo, (name, fileNameExtension, encoding, mimeType, willSeek) =>
                    {
                        var stream = new MemoryStream();
                        streams.Add(stream);
                        return stream;
                    }, out _);

                    foreach (Stream stream in streams)
                        stream.Position = 0;

                    if (streams == null || streams.Count == 0)
                    {
                        throw new Exception("Error: no stream to print.");
                    }

                    PrintDocument printDoc = new PrintDocument();
                    printDoc.PrinterSettings.PrinterName = printerName;
                    PrinterSettings pageSettings = new PrinterSettings();
                    pageSettings.PrinterName = printerName;
                    printDoc.DefaultPageSettings = pageSettings.DefaultPageSettings;

                    int currentIndex = 0;
                    if (printDoc.PrinterSettings.IsValid)
                    {
                        printDoc.PrintPage += (sender, e) =>
                        {
                            Metafile pageImage = new Metafile(streams[currentIndex]);
                            e.Graphics.DrawImage(
                                pageImage, e.PageBounds);
                            currentIndex++;
                            e.HasMorePages = (currentIndex < streams.Count);
                        };
                        printDoc.EndPrint += (sender, e) =>
                        {
                            if (streams != null)
                            {
                                foreach (Stream item in streams)
                                {
                                    item.Close();
                                }
                                streams.Clear();
                            }
                        };
                        printDoc.Print();
                        return true;
                    }
                }
            }
            catch (Exception ex)
            {
                var appLog = new EventLog("Application");
                var eventSource = "PrintServer";
                appLog.Source = EventsLogs.CreateEventSource(eventSource);
                appLog.WriteEntry(ex.StackTrace, EventLogEntryType.Error);
                return false;
            }
            return false;
        }

    }

}