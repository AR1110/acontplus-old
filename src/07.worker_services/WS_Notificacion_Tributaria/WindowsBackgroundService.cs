using BL.Notificacion;
using BL.Reports;
using Common.Logs;
using DataAccess;
using Domain.Dtos;
using Domain.Models;
using Newtonsoft.Json;
using System.Data;
using System.Text;
using System.Web;

namespace WS_Notificacion_Tributaria
{
    public class WindowsBackgroundService : BackgroundService
    {
        private readonly IConfiguration _configuration;
        private readonly NotTribService _notService;
        private readonly Reports _reports;
        private readonly ILogger<WindowsBackgroundService> _logger;

        public WindowsBackgroundService(ILogger<WindowsBackgroundService> logger,
             NotTribService notService,
             IConfiguration configuration,
             Reports reports)
        {
            _logger = logger;
            _notService = notService;
            _configuration = configuration;
            _reports = reports;
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

                        Parallel.ForEach(dt.AsEnumerable(), async drow =>
                        {
                            await GetData(drow);
                        });
                    }

                    await Task.Delay(TimeSpan.FromSeconds(Convert.ToDouble(_configuration.GetSection("intervalo").Value)), stoppingToken);
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "{Message}", ex.Message);
                _log.LogError("Error sending notification tributaria: " + ex.ToString());
                Environment.Exit(1);
            }
        }
        public async Task<bool> GetData(DataRow dataRow)
        {
            Email _email = new Email();
            LogWriter _log = new LogWriter(_configuration);
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                if (string.IsNullOrEmpty(dataRow.Field<string>("receptor")))
                {
                    _notService.Update(dataRow.Field<long>("idNotificacionTributaria"), "ERROR", "No se encontro el receptor");
                    return false;
                }

                ApiReportParamsDto data = new ApiReportParamsDto();

                DataTable _dt = await _notService.GetDataComprobanteReport(dataRow.Field<string>("jsonParmeter"));

                if (_dt.Rows.Count > 0)
                {
                    data.reportParams = JsonConvert.SerializeObject(_dt);
                }
                else
                {
                    return false;
                }

                var reportParams = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, string>>>(data.reportParams);
                var dataMail = reportParams.FirstOrDefault();
                FileModel reportFile = new FileModel();
                FileModel xmlFile = new FileModel();
                string mimeType = string.Empty;
                string fileName = string.Empty;
                byte[] bytesPdf = _reports.ByteReportDynamic(data.reportParams, ref mimeType, ref fileName);
                reportFile.Create(bytesPdf, mimeType, fileName);
                if (bytesPdf == null || bytesPdf.Length == 0) return false;
                string xmlSri = string.Empty;
                xmlSri = HttpUtility.HtmlDecode(dataRow.Field<string>("xmlSri"));
                byte[] byteXml = Encoding.UTF8.GetBytes(xmlSri);
                xmlFile.Create(byteXml, "text/xml", dataRow.Field<string>("comprobante") + ".xml");

                var files = new List<FileModel>
                {
                    reportFile,
                    xmlFile
                };

                _email.host = dataMail["host"].ToString();
                _email.port = Convert.ToInt32(dataMail["port"]);
                _email.enableSsl = dataMail["EnableSsl"] == "1" ? true : false;
                _email.logo = dataMail["logo"].ToString();
                _email.from = dataMail["from"].ToString();
                _email.password = dataMail["password"].ToString();
                _email.cc = dataMail["cc"].ToString();
                _email.subject = dataMail["subject"].ToString();
                _email.dataMail = dataMail["dataMail"].ToString();
                _email.to = dataRow.Field<string>("receptor");
                _email.template = "EmailTemplate_Trib.html";
                _email.files = files;

                string msgError = string.Empty;

                SendEmail _sendEmail = new SendEmail(_configuration);
                if (_sendEmail.Send(_email, ref msgError))
                {
                    _notService.Update(dataRow.Field<long>("idNotificacionTributaria"), "E");
                    _log.LogInfo("Notificación enviada: idNotificacion -> " + Convert.ToString(dataRow.Field<long>("idNotificacionTributaria")));
                }
                else
                {
                    _notService.Update(dataRow.Field<long>("idNotificacionTributaria"), "EE", msgError);
                    _log.LogError("No se pudo enviar la notificación: idNotificacion -> " + Convert.ToString(dataRow.Field<long>("idNotificacionTributaria")) + "\n" + msgError);
                }
                bytesPdf = null;
                byteXml = null;
                return true;
            }
            catch (Exception ex)
            {
                _notService.Update(dataRow.Field<long>("idNotificacionTributaria"), "ERROR", ex.ToString());
                _log.LogError("Error al enviar la notificación: idNotificacion -> " + Convert.ToString(dataRow.Field<long>("idNotificacionTributaria")) + " - " + ex.ToString());
                return false;
            }
        }
    }
}