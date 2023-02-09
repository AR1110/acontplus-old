using HelpersNS20.Dtos;
using Logs;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;
using System.Timers;
using System.Web;

namespace NotifierWS
{
    public partial class Notifier : ServiceBase
    {
        Timer timer = new Timer();
        private readonly string _path = "";
        private readonly int _interval = 0;
        public readonly string _urlSri = "";
        private static object _intervalSync = new object();
        public Notifier()
        {
            _path = ConfigurationManager.AppSettings["dirLogs"].ToString();
            _interval = Convert.ToInt32(ConfigurationManager.AppSettings["intervalo"]);
            _urlSri = ConfigurationManager.AppSettings["urlSri"].ToString();
            InitializeComponent();
#if DEBUG
            OnStart(null);
#endif
        }

        protected override void OnStart(string[] args)
        {
            LogWritter.LogInfo(_path, "Service Notifier is started at");
            timer.Elapsed += new ElapsedEventHandler(SenderJob);
            timer.Interval = _interval; //number in milisecinds  
            timer.Enabled = true;
        }

        protected override void OnStop()
        {
            LogWritter.LogWarning(_path, "Service Notifier is stopped at");
        }
        private void SenderJob(object source, ElapsedEventArgs e)
        {
            DataTable dt = new DataTable();
            if (System.Threading.Monitor.TryEnter(_intervalSync))
            {
                try
                {
                    if (!new DataAccess().Get(ref dt, Convert.ToInt32(ConfigurationManager.AppSettings["cantDocs"]))) return;
                    LogWritter.LogInfo(_path, "Service Notifier is processing");
                    Execute(dt);
                }
                catch (Exception ex)
                {
                    LogWritter.LogError(_path, "Error al enviar notificaciones de los docs: " + " - " + ex.Message + "Docs: " + HelpersNS20.DataHelperNS.DataTableToJSON(dt));
                }
                finally
                {
                    System.Threading.Monitor.Exit(_intervalSync);
                }
            }
        } 

        public void Execute(DataTable dt)
        {
            ParallelOptions po = new ParallelOptions
            {
                MaxDegreeOfParallelism = 50
            };
            Parallel.ForEach(dt.AsEnumerable(), po, drow =>
            {
                Email _email = new Email();
                if (GetData(drow, ref _email))
                {
                    Send(drow.Field<long>("idNotificacionTributaria"), _email);
                }
            });
        }
        public bool GetData(DataRow dataRow, ref Email _email)
        {
            try
            {
                //if (!new DataAccess().GetInfoDoc(ref ds, dataRow.Field<int>("idDocumentoElectronico"))) { return; }

                //RIDE DE API CON JSON -- OTRO SP --
                ApiReportParamsDto data = new ApiReportParamsDto();
                if (string.IsNullOrEmpty(dataRow.Field<string>("receptor")))
                {
                    new DataAccess().Update(dataRow.Field<long>("idNotificacionTributaria"), "ERROR", "No se encontro el receptor");
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
                if (!new DataAccess().GetDataComprobanteReport(ref data, dataRow.Field<string>("jsonParmeter"))) return false;

                //data.reportParams = data.reportParams;

                var reportParams = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, string>>>(data.reportParams);
                var dataMail = reportParams.FirstOrDefault();


                FileModel reportFile = new FileModel();
                FileModel xmlFile = new FileModel();
                ApiReportParamsDto _dataReport = ConverToModelReportParams(data);
                string mimeType = string.Empty;
                string fileName = string.Empty;
                byte[] bytesPdf = new GenerateReport().ByteReportDynamic(_dataReport, ref mimeType, ref fileName);
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

                _email.host = dataMail["host"].ToString();
                _email.port = Convert.ToInt32(dataMail["port"]);
                _email.enableSsl = dataMail["EnableSsl"] == "1" ? true : false;
                _email.logo = dataMail["logo"].ToString();
                _email.from = dataMail["from"].ToString();
                _email.pwd = dataMail["password"].ToString();
                _email.cc = dataMail["cc"].ToString();
                _email.subject = dataMail["subject"].ToString();
                _email.dataMail = dataMail["dataMail"].ToString();
                _email.to = dataRow.Field<string>("receptor");
                _email.files = files;
                bytesPdf = null;
                byteXml = null;
                return true;
            }
            catch (Exception ex)
            {
                new DataAccess().Update(dataRow.Field<long>("idNotificacionTributaria"), "ERROR", ex.Message);
                LogWritter.LogError(_path, "Error al enviar por correo el documento: idNot - " + Convert.ToString(dataRow.Field<long>("idNotificacionTributaria")) + " - " + ex.Message);
                return false;
            }
        }
        public void Send(long id, Email email)
        {
            SendEmail _sendEmail = new SendEmail();
            if (_sendEmail.Send(email))
            {
                new DataAccess().Update(id, "E");
                LogWritter.LogInfo(_path, "Doc. Enviado por email: idNot-" + Convert.ToString(id));
            }
            else
            {
                new DataAccess().Update(id, "ERROR");
                LogWritter.LogError(_path, "Error al enviar por correo el documento: idNot-" + Convert.ToString(id));
            }
        }
        public static ApiReportParamsDto ConverToModelReportParams(ApiReportParamsDto data)
        {
            ApiReportParamsDto _response = new ApiReportParamsDto();
            Dictionary<string, string> rdlcParams = new Dictionary<string, string>();
            var _arrayProps = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, string>>>(data.reportParams);

            foreach (var item in _arrayProps.FirstOrDefault())
            {
                if (item.Key == "imagen" && !string.IsNullOrEmpty(item.Value))
                {
                    rdlcParams.Add(item.Key, item.Value);
                }

                if (item.Key == "claveAcceso" && !string.IsNullOrEmpty(item.Value))
                {
                    rdlcParams.Add(item.Key, item.Value);
                }

                if (item.Key == "rdlcParams" && !string.IsNullOrEmpty(item.Value.ToString()))
                {
                    var arrayParams = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, string>>>(item.Value);
                    foreach (var paramRdlc in arrayParams.FirstOrDefault())
                    {
                        rdlcParams.Add(paramRdlc.Key, paramRdlc.Value);
                    }

                }

                if (item.Key == "dataSources" && !string.IsNullOrEmpty(item.Value.ToString()))
                {
                    var arrayDS = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, string>>>(item.Value.ToString());
                    Dictionary<string, List<Dictionary<string, string>>> ldDataSources = new Dictionary<string, List<Dictionary<string, string>>>();

                    foreach (var dataSource in arrayDS.FirstOrDefault())
                    {
                        var dataDS = JsonConvert.DeserializeObject<IEnumerable<IDictionary<string, string>>>(dataSource.Value);
                        List<Dictionary<string, string>> dataSources = new List<Dictionary<string, string>>();

                        foreach (var value in dataDS)
                        {
                            Dictionary<string, string> itemDs = new Dictionary<string, string>();
                            foreach (var de in value)
                            {
                                itemDs.Add(de.Key, de.Value);
                            }
                            dataSources.Add(itemDs);
                        }
                        ldDataSources.Add(dataSource.Key, dataSources);
                    }
                    _response.dataSources = ldDataSources;
                }
            }

            _response.rdlcParams = rdlcParams;

            return _response;
        }
        public static bool EmailIsValid(string email)

        {

            string _regexPattern = @"^(([\w-]+\.)+[\w-]+|([a-zA-Z]{1}|[\w-]{2,}))@"
                    + @"((([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\.([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\."
                    + @"([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])\.([0-1]?[0-9]{1,2}|25[0-5]|2[0-4][0-9])){1}|"
                    + @"([a-zA-Z]+[\w-]+\.)+[a-zA-Z]{2,4})$";

            return (string.IsNullOrEmpty(email) == false && System.Text.RegularExpressions.Regex.IsMatch(email, _regexPattern))
                ? true
                : false;
        }
    }
}
