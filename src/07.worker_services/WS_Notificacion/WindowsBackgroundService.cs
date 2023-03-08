using Common.Logs;
using Domain.Models;
using Newtonsoft.Json;
using System.Data;
using System.Text;
using System.Web;

namespace WS_Notificacion
{
    public class WindowsBackgroundService : BackgroundService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<WindowsBackgroundService> _logger;
        private readonly NotificacionService _notService;

        public WindowsBackgroundService(ILogger<WindowsBackgroundService> logger, NotificacionService notService, IConfiguration configuration)
        {
            _logger = logger;
            _notService = notService;
            _configuration = configuration;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            LogWriter _log = new LogWriter(_configuration);

            try
            {
                while (!stoppingToken.IsCancellationRequested)
                {
                    DataTable dt = await _notService.Get(Convert.ToInt32(_configuration.GetSection("cantidad").Value));

                    if (!dt.Columns.Contains("code") && dt.Rows.Count > 0)
                    {

                        Parallel.ForEach(dt.AsEnumerable(), drow =>
                        {
                            //Download(drow);
                        });
                    }

                    await Task.Delay(TimeSpan.FromSeconds(Convert.ToDouble(_configuration.GetSection("intervalo").Value)), stoppingToken);
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "{Message}", ex.Message);
                _log.LogError("Error sending notification: " + ex.ToString());
                Environment.Exit(1);
            }
        }

        public bool GetData(DataRow dataRow, ref Email _email)
        {
            LogWriter _log = new LogWriter(_configuration);
            try
            {
                //if (!new DataAccess().GetInfoDoc(ref ds, dataRow.Field<int>("idDocumentoElectronico"))) { return; }

                //RIDE DE API CON JSON -- OTRO SP --                
                if (string.IsNullOrEmpty(dataRow.Field<string>("receptor")))
                {
                    // new DataAccess().Update(dataRow.Field<long>("idNotificacionTributaria"), "ERROR", "No se encontro el receptor");
                    return false;
                }
                //string[] mails = dataRow.Field<string>("receptor").Trim().Split(',');
                //foreach (var item in mails)
                //{
                //    if (!EmailIsValid(item))
                //    {
                //        new DataAccess().Update(dataRow.Field<long>("idNotificacionTributaria"), "ERROR", "Error al enviar por correo el documento: Email Invalido -> " + item);
                //        LogWritter.LogError(_path, "Error al enviar por correo el documento: Email Invalido -> " + item);
                //        return false;
                //    }
                //}

                //                if (!new DataAccess().GetDataComprobanteReport(ref data, dataRow.Field<string>("jsonParmeter"))) return false;

                //data.reportParams = data.reportParams;
                var reportParams = "";
                //var reportParams = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, string>>>(data.reportParams);
                var dataMail = reportParams.FirstOrDefault();


                FileModel reportFile = new FileModel();
                FileModel xmlFile = new FileModel();
                //   ApiReportParamsDto _dataReport = ConverToModelReportParams(data);
                string mimeType = string.Empty;
                string fileName = string.Empty;

                byte[] bytesPdf = null;
                //  byte[] bytesPdf = new GenerateReport().ByteReportDynamic(_dataReport, ref mimeType, ref fileName);
                reportFile.Create(bytesPdf, mimeType, fileName);
                //reportFile = await new ApiServer(_urlApiReports).PostAsync<FileModel>("api/Reporte/DynamicReport/", data);
                //System.Threading.Thread.Sleep(5000);

                //if (reportFile.Content == null || reportFile.Content.Length == 0) return false;

                if (bytesPdf == null || bytesPdf.Length == 0) return false;

                //XML DE DB SI EXISTE - SINO DE SRI
                string xmlSri = string.Empty;
                //if (string.IsNullOrEmpty(dataRow.Field<string>("xmlSri")))
                //{
                //    xmlSri = await new WebServiceSri().GetXmlAsync(dataRow.Field<string>("claveAcceso"), _urlSri);
                //    if (xmlSri != null)
                //    {
                //        xmlSri = HttpUtility.HtmlDecode(xmlSri);
                //        byte[] byteXml = Encoding.UTF8.GetBytes(xmlSri);
                //        xmlFile.Create(byteXml, "text/xml", dataRow.Field<string>("comprobante"));
                //    }
                //}
                //else
                //{
                xmlSri = HttpUtility.HtmlDecode(dataRow.Field<string>("xmlSri"));
                byte[] byteXml = Encoding.UTF8.GetBytes(xmlSri);
                xmlFile.Create(byteXml, "text/xml", dataRow.Field<string>("comprobante"));
                //}

                var files = new List<FileModel>
                {
                    reportFile,
                    xmlFile
                };

                //_email.host = dataMail["host"].ToString();
                //_email.port = Convert.ToInt32(dataMail["port"]);
                //_email.enableSsl = dataMail["EnableSsl"] == "1" ? true : false;
                //_email.logo = dataMail["logo"].ToString();
                //_email.from = dataMail["from"].ToString();
                //_email.password = dataMail["password"].ToString();
                //_email.cc = dataMail["cc"].ToString();
                //_email.subject = dataMail["subject"].ToString();
                //_email.dataMail = dataMail["dataMail"].ToString();
                _email.to = dataRow.Field<string>("receptor");
                _email.files = files;
                bytesPdf = null;
                byteXml = null;
                return true;
            }
            catch (Exception ex)
            {
                //new DataAccess().Update(dataRow.Field<long>("idNotificacionTributaria"), "ERROR", ex.ToString());
                _log.LogError("Error al enviar por correo la notificación: idNot - " + Convert.ToString(dataRow.Field<long>("idNotificacion")) + " - " + ex.ToString());
                return false;
            }
        }

        public async void SendMail()
        {

        }
    }
}