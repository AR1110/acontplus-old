using Common.Logs;
using Domain.Config.Dtos;
using Helpers;
using Microsoft.Reporting.NETCore;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Drawing.Imaging;
using System.Drawing.Printing;

namespace BL.Print
{
    public sealed class RdlcPrint
    { 
        public static bool Print(PrinterDto printer, ApiPrintRequestDto parameters, string printerName)
        {
            var streams = new List<Stream>();
            try
            {
                using (LocalReport lr = new LocalReport())
                {
                    //lr.ReportPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports", printer.rdlcName);
                    lr.LoadReportDefinition(LoadReportDefinition(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports", printer.rdlcName)));
                    if (parameters.dataSources != null)
                    {
                        foreach (var item in parameters.dataSources)
                        {
                            lr.DataSources.Add(new ReportDataSource(item.Key, DataHelper.JsonToDataTable(JsonConvert.SerializeObject(item.Value))));
                        }
                    }

                    if (printer.hasParams && parameters.rdlcParams != null)
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

                    lr.Render(printer.formato, printer.deviceInfo, (name, fileNameExtension, encoding, mimeType, willSeek) =>
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
        public static MemoryStream LoadReportDefinition(string filePath)
        {
            MemoryStream memoryStream = new MemoryStream();
            using (FileStream fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read))
            {
                fileStream.CopyTo(memoryStream);
            }
            memoryStream.Seek(0, SeekOrigin.Begin);
            return memoryStream;
        }
    }
}