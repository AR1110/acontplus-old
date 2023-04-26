using BL.Notificacion;
using BL.Reports;
using Common.Logs;
using DataAccess;
using Domain.Models;
using Microsoft.AspNetCore.StaticFiles;
using Newtonsoft.Json;
using System.Data;

namespace WS_Notificacion
{
    public class WindowsBackgroundService : BackgroundService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<WindowsBackgroundService> _logger;
        private readonly NotificacionService _notService;
        private readonly Reports _reports;

        public WindowsBackgroundService(ILogger<WindowsBackgroundService> logger,
            NotificacionService notService,
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
                _log.LogError("Error sending notification: " + ex.ToString());
                Environment.Exit(1);
            }
        }

        public async Task<bool> GetData(DataRow dataRow)
        {
            Email _email = new Email();
            LogWriter _log = new LogWriter(_configuration);
            try
            {
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

                var mainParams = JsonConvert.DeserializeObject<Dictionary<string, object>[]>(dataRow.Field<string>("params"));
                string hasFile = string.Empty, isReport = string.Empty, reportParams = string.Empty, spParams = string.Empty;
                foreach (var item in mainParams[0])
                {
                    if (item.Key == "hasFile")
                    {
                        hasFile = item.Value.ToString();
                    }
                    if (item.Key == "isReport")
                    {
                        isReport = item.Value.ToString();
                    }
                    if (item.Key == "reportParams")
                    {
                        reportParams = item.Value.ToString();
                    }
                    if (item.Key == "spParams")
                    {
                        spParams = item.Value.ToString();
                    }
                }

                FileModel reportFile = new FileModel();
                byte[] bytesPdf = null;
                string mimeType = string.Empty, fileName = string.Empty;

                if (Convert.ToBoolean(hasFile))
                {
                    switch (isReport)
                    {
                        case "NO":

                        default:
                            DbAccess _db = new DbAccess(_configuration);
                            await _db.SPExecute("Reporte.Report_Get");
                            _db.AddDynamicParam("json", reportParams);
                            DataSet dsParams = _db.GetDataSet();

                            await _db.SPExecute(dsParams.Tables[0].Rows[0]["storedProcedure"].ToString());
                            _db.AddDynamicParam("json", spParams);
                            DataSet ds = _db.GetDataSet();

                            bytesPdf = _reports.ByteReport(dsParams, ds, true);

                            if (bytesPdf == null || bytesPdf.Length == 0)
                            {
                                _notService.Update(dataRow.Field<int>("idNotificacion"), "NE", "No se pudo generar el reporte");
                                return false;
                            };

                            fileName = dsParams.Tables[0].Rows[0].Field<string>("fileName");

                            var provider = new FileExtensionContentTypeProvider();
                            if (!provider.TryGetContentType(fileName, out mimeType))
                            {
                                mimeType = "application/octet-stream";
                            }

                            reportFile.Create(bytesPdf, mimeType, fileName);

                            var files = new List<FileModel>
                            {
                                reportFile
                            };
                            _email.files = files;
                            break;
                    }
                }

                var emailData = JsonConvert.DeserializeObject<Dictionary<string, object>[]>(dataRow.Field<string>("emailData"));
                var dataMail = emailData.FirstOrDefault();
                _email.host = dataMail["host"].ToString();
                _email.port = Convert.ToInt32(dataMail["port"]);
                _email.enableSsl = dataMail["EnableSsl"].ToString() == "1" ? true : false;
                _email.logo = dataMail["logo"].ToString();
                _email.from = dataMail["from"].ToString();
                _email.password = dataMail["password"].ToString();
                _email.cc = dataMail["cc"].ToString();
                _email.subject = dataMail["subject"].ToString();
                _email.dataMail = dataMail["body"].ToString();
                _email.template = dataMail["template"].ToString();
                _email.to = dataRow.Field<string>("receptor");

                string msgError = string.Empty;

                SendEmail _sendEmail = new SendEmail(_configuration);
                if (_sendEmail.Send(_email, ref msgError))
                {
                    _notService.Update(dataRow.Field<int>("idNotificacion"), "E");
                    _log.LogInfo("Notificación enviada: idNotificacion -> " + Convert.ToString(dataRow.Field<int>("idNotificacion")));
                }
                else
                {
                    _notService.Update(dataRow.Field<int>("idNotificacion"), "EE", msgError);
                    _log.LogError("No se pudo enviar la notificación: idNotificacion -> " + Convert.ToString(dataRow.Field<int>("idNotificacion")) + "\n" + msgError);
                }
                bytesPdf = null;
                return true;
            }
            catch (Exception ex)
            {
                _notService.Update(dataRow.Field<int>("idNotificacion"), "ERROR", ex.ToString());
                _log.LogError("Error al enviar la notificación: idNotificacion -> " + Convert.ToString(dataRow.Field<int>("idNotificacion")) + " - " + ex.ToString());
                return false;
            }
        }
    }
}