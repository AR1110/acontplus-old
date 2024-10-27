using System.Data;
using System.Text;
using System.Web;
using System.Collections.Concurrent;
using Microsoft.Extensions.Configuration;
using Microsoft.Reporting.NETCore;
using Reports.Application.Enums;
using Reports.Application.Interfaces;
using Reports.Application.Models;
using Common.Core.Utils;
using static System.Enum;

namespace Reports.Application.Services
{
    public class RdlcReportService : IRdlcReportService, IDisposable
    {
        private readonly IConfiguration _configuration;
        private readonly ConcurrentDictionary<string, Lazy<MemoryStream>> _reportCache;
        private bool _disposed;
        private const int CacheLimit = 50; // Example cache limit

        public RdlcReportService(IConfiguration configuration)
        {
            _configuration = configuration;
            _reportCache = new ConcurrentDictionary<string, Lazy<MemoryStream>>();
        }

        public ReportResponse GetReport(DataSet parameters, DataSet data, bool offline = false)
        {
            var response = new ReportResponse();
            var reportProps = DataTableMapper.BindData<ReportProps>(parameters.Tables["ReportProps"]);

            using var lr = new LocalReport();
            string reportPath = GetReportPath(parameters, reportProps, offline);

            using var reportDefinitionStream = GetOrAddReportDefinition(reportPath).Value;
            reportDefinitionStream.Seek(0, SeekOrigin.Begin); // Ensure the stream position is reset before reading
            lr.LoadReportDefinition(reportDefinitionStream);

            AddDataSources(lr, parameters, data);
            AddReportParameters(lr, parameters, data);

            var fileReport = lr.Render(reportProps.ReportFormat, null, out _, out _, out _, out _, out _);
            response = BuildReportResponse(reportProps, fileReport);

            return response;
        }

        private Lazy<MemoryStream> GetOrAddReportDefinition(string reportPath)
        {
            EnsureCacheLimit();

            return _reportCache.GetOrAdd(reportPath, path =>
            {
                return new Lazy<MemoryStream>(() =>
                {
                    using var stream = RdlcHelpers.LoadReportDefinition(path);
                    var memoryStream = new MemoryStream();
                    stream.CopyTo(memoryStream); // Copy the content directly to a new MemoryStream
                    return memoryStream;
                });
            });
        }

        private void EnsureCacheLimit()
        {
            if (_reportCache.Count >= CacheLimit)
            {
                var keysToRemove = _reportCache.Keys.Take(_reportCache.Count - CacheLimit).ToList();
                foreach (var key in keysToRemove)
                {
                    if (_reportCache.TryRemove(key, out var lazyMemoryStream))
                    {
                        if (lazyMemoryStream.IsValueCreated)
                        {
                            lazyMemoryStream.Value.Dispose();
                        }
                    }
                }
            }
        }

        private string GetReportPath(DataSet parameters, ReportProps reportProps, bool offline)
        {
            if (offline)
            {
                var value = _configuration.GetSection("dirReports").Value;
                if (value != null)
                {
                    return Path.Combine(value, parameters.Tables[0].Rows[0]["reportPath"].ToString());
                }
            }
            else
            {
                var mainPath = Path.Combine(Directory.GetCurrentDirectory(), "Reports");
                var paths = reportProps.ReportPath.Split("/").Where(s => !string.IsNullOrEmpty(s)).ToArray();

                return paths.Length switch
                {
                    1 => Path.Combine(mainPath, paths[0]),
                    2 => Path.Combine(mainPath, paths[0], paths[1]),
                    _ => Path.Combine(mainPath, reportProps.ReportPath),
                };
            }
            return string.Empty;
        }

        private void AddDataSources(LocalReport lr, DataSet parameters, DataSet data)
        {
            if (parameters.Tables.Contains("DataSources"))
            {
                var dataSources = parameters.Tables["DataSources"];
                foreach (DataRow row in dataSources.Rows)
                {
                    lr.DataSources.Add(new ReportDataSource(row["dataSource"].ToString(), data.Tables[row.Field<int>("position")]));
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
        }

        private void AddReportParameters(LocalReport lr, DataSet parameters, DataSet data)
        {
            var firstDataSource = data.Tables[0];
            if (firstDataSource.Columns.Contains("codigoAutorizacion"))
            {
                var byteBarcode = BarcodeGen.Create(firstDataSource.Rows[0].Field<string>("codigoAutorizacion"));
                var base64Barcode = Convert.ToBase64String(byteBarcode);
                lr.SetParameters(new ReportParameter("barcode", base64Barcode));
                lr.SetParameters(new ReportParameter("mimeTypeBarcode", "image/png"));
            }

            if (parameters.Tables.Contains("ReportParams") && parameters.Tables["ReportParams"].Rows.Count > 0)
            {
                foreach (DataRow item in parameters.Tables["ReportParams"].Rows)
                {
                    string paramValue = "";
                    if (Convert.ToBoolean(item["isPicture"]))
                    {
                        byte[] imageBytes = item.Field<bool>("isCompressed")
                            ? CompressionUtils.DecompressDeflate((byte[])item["paramValue"])
                            : (byte[])item["paramValue"];

                        paramValue = Convert.ToBase64String(imageBytes);
                    }
                    else
                    {
                        paramValue = Encoding.UTF8.GetString(item.Field<byte[]>("paramValue"));
                    }
                    lr.SetParameters(new ReportParameter(item["paramName"].ToString(), paramValue));
                }
            }
        }

        private ReportResponse BuildReportResponse(ReportProps reportProps, byte[] fileReport)
        {
            TryParse(reportProps.ReportFormat.ToUpper(), out FileFormats.FileContentType fc);
            TryParse(reportProps.ReportFormat.ToUpper(), out FileFormats.FileExtension fe);

            return new ReportResponse
            {
                FileContents = fileReport,
                ContentType = fc.DisplayName(),
                FileDownloadName = HttpUtility.UrlEncode(reportProps.ReportName + fe.DisplayName(), Encoding.UTF8)
            };
        }

        public async Task<ReportResponse> GetErrorAsync()
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Reports", "NotFound.pdf");
            var fileContents = await File.ReadAllBytesAsync(filePath);
            return new ReportResponse
            {
                FileContents = fileContents,
                ContentType = "application/pdf",
                FileDownloadName = "Not Found.pdf"
            };
        }

        private void CleanupCache()
        {
            foreach (var lazyMemoryStream in _reportCache.Values)
            {
                if (lazyMemoryStream.IsValueCreated)
                {
                    lazyMemoryStream.Value.Dispose();
                }
            }
            _reportCache.Clear();
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (_disposed)
                return;

            if (disposing)
            {
                CleanupCache();
            }

            _disposed = true;
        }

        ~RdlcReportService()
        {
            Dispose(false);
        }
    }
}
