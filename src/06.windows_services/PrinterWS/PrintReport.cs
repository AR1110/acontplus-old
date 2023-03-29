using Logs;
using Microsoft.Reporting.WebForms;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Drawing.Imaging;
using System.Drawing.Printing;
using System.IO;

namespace PrinterWS
{
    public class PrintReport
    {
        private readonly string _dirLogs = string.Empty;
        public PrintReport()
        {
            _dirLogs = System.Configuration.ConfigurationManager.AppSettings["dirLogs"];
        }
        //visit https://social.msdn.microsoft.com/Forums/vstudio/en-US/47179a04-e464-429a-92b0-2389d77a1219/report-printing?forum=vbgeneral
        
        public bool DynamicPrint(ApiReportParamsDto parameters, ref string errorMessage)
        {
            var streams = new List<Stream>();
            try
            {

                using (LocalReport lr = new LocalReport())
                {
                    string printerName = string.Empty;
                    bool isThermal = false;
                    string format = string.Empty;
                    string deviceInfo = string.Empty;
                    foreach (var item in parameters.rdlcProps)
                    {
                        if (item.Key == "rdlcName")
                        {
                            var pa = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports", item.Value);
                            lr.ReportPath = pa;
                            //lr.ReportPath = Path.Combine(System.Web.Hosting.HostingEnvironment.MapPath("~/Reports"), item.Value);
                        }
                        if (item.Key == "printerName")
                        {
                            printerName = item.Value;
                        }
                        if (item.Key == "isThermal")
                        {
                            isThermal = Convert.ToBoolean(item.Value);
                           
                        }
                        if (item.Key == "format")
                        {
                            format = item.Value;
                        }
                        if(item.Key == "deviceInfo")
                        {
                            deviceInfo = item.Value;
                        }
                    }
                    if (parameters.dataSources != null)
                    {
                        foreach (var item in parameters.dataSources)
                        {
                            lr.DataSources.Add(new ReportDataSource(item.Key, DataHelperNS.JsonToDataTable(JsonConvert.SerializeObject(item.Value))));
                        }
                    }

                    if (parameters.rdlcParams != null)
                    {
                        int index = 0;
                        ReportParameter[] rp = new ReportParameter[parameters.rdlcParams.Keys.Count];
                        foreach (var item in parameters.rdlcParams)
                        {
                            rp[index++] = new ReportParameter(item.Key, item.Value);
                        }
                        lr.SetParameters(rp);
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
                        //int milliseconds = 3000;
                        //Thread.Sleep(milliseconds);
                        printDoc.PrinterSettings.PrinterName = printerName;
                        printDoc.Print();
                        return true;
                    }
                }
            }
            catch (Exception ex)
            {
                LogWritter.LogError(_dirLogs, ex.Message);
                errorMessage = ex.Message;
                return false;
            }
            return false;
        }
    }
}