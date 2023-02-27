using Common.Logs;
using FactElect;
using System.Data;
using System.Xml;

namespace WS_DocumentoRecibido
{
    public class WindowsBackgroundService : BackgroundService
    {
        //Instructions to Install
        //sc.exe create "WS_DocumentoRecibido" binpath="C:\Acontplus\WorkerServices\WS_DocumentoRecibido\WS_DocumentoRecibido.exe"
        //sc.exe delete "WS_DocumentoRecibido"

        private readonly IConfiguration _configuration;
        private readonly ILogger<WindowsBackgroundService> _logger;
        private readonly DocumentoService _docService;

        public WindowsBackgroundService(ILogger<WindowsBackgroundService> logger,
            IConfiguration configuration,
            DocumentoService emailService) =>
            (_logger, _configuration, _docService) = (logger, configuration, emailService);
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            LogWriter _log = new LogWriter(_configuration);

            try
            {
                while (!stoppingToken.IsCancellationRequested)
                {
                    DataTable dt = await _docService.Get(Convert.ToInt32(_configuration.GetSection("cantDocs").Value));

                    if (!dt.Columns.Contains("code") && dt.Rows.Count > 0)
                    {
                        //    _log.LogError(dt.Rows[0]["message"].ToString() + ": " + dt.Rows[0]["payload"].ToString());
                        //}
                        //else
                        //{

                        Parallel.ForEach(dt.AsEnumerable(), drow =>
                        {
                            FastDownload(drow);
                        });
                        //foreach (DataRow item in dt.Rows)
                        //{
                        //    string xml = await new WebServiceSri().GetXmlAsync(dt.Rows[0]["claveAcceso"].ToString(), _configuration.GetSection("urlSri").Value);
                        //    if (xml.Trim().Length > 500)
                        //    {
                        //        XmlDocument xmlDocSri = new XmlDocument();
                        //        xmlDocSri.LoadXml(xml);

                        //        XmlNode nodeAuth = xmlDocSri.GetElementsByTagName("autorizacion")[0];
                        //        XmlNode nodeComp = nodeAuth.SelectSingleNode("comprobante");
                        //        XmlDocument xmlComp = new XmlDocument();
                        //        xmlComp.LoadXml(nodeComp.InnerText);

                        //        XmlNode node = xmlComp.GetElementsByTagName("infoTributaria")[0];
                        //        string codDoc = node.SelectSingleNode("codDoc").InnerText;
                        //        _log.LogInfo("Xml Doc Downloaded: " + dt.Rows[0]["claveAcceso"].ToString());
                        //        await _docService.Update(new Guid(dt.Rows[0]["idDocumento"].ToString()), "DE", codDoc, xmlDocSri.OuterXml);
                        //    }
                        //    else
                        //    {
                        //        _log.LogWarning("XML of doc doesnt exists in sri");
                        //        await _docService.Update_Error(new Guid(dt.Rows[0]["idDocumento"].ToString()), "NE");
                        //    }
                        //}
                    }
                    await Task.Delay(TimeSpan.FromSeconds(Convert.ToDouble(_configuration.GetSection("intervalo").Value)), stoppingToken);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "{Message}", ex.Message);
                _log.LogError("Error while downloading xml from sri: " + ex.ToString());
                Environment.Exit(1);
                //await _docService.Update_Error(new Guid(dt.Rows[0]["idDocumento"].ToString()), "ER");
            }
        }
        public async void FastDownload(DataRow dr)
        {
            LogWriter _log = new LogWriter(_configuration);

            string xml = await new WebServiceSri().GetXmlAsync(dr["claveAcceso"].ToString(), _configuration.GetSection("urlSri").Value);
            if (xml.Trim().Length > 500)
            {
                XmlDocument xmlDocSri = new XmlDocument();
                xmlDocSri.LoadXml(xml);

                XmlNode nodeAuth = xmlDocSri.GetElementsByTagName("autorizacion")[0];
                XmlNode nodeComp = nodeAuth.SelectSingleNode("comprobante");
                XmlDocument xmlComp = new XmlDocument();
                xmlComp.LoadXml(nodeComp.InnerText);

                XmlNode node = xmlComp.GetElementsByTagName("infoTributaria")[0];
                string codDoc = node.SelectSingleNode("codDoc").InnerText;
                string versionComp = string.Empty;
                switch (codDoc)
                {
                    case "01":
                        versionComp = xmlComp.GetElementsByTagName("factura")[0].Attributes["version"].Value;
                        break;
                    case "03":
                        versionComp = xmlComp.GetElementsByTagName("liquidacionCompra")[0].Attributes["version"].Value;
                        break;
                    case "04":
                        versionComp = xmlComp.GetElementsByTagName("notaCredito")[0].Attributes["version"].Value;
                        break;
                    case "05":
                        versionComp = xmlComp.GetElementsByTagName("notaDebito")[0].Attributes["version"].Value;
                        break;
                    case "06":
                        versionComp = xmlComp.GetElementsByTagName("guiaRemision")[0].Attributes["version"].Value;
                        break;
                    case "07":
                        versionComp = xmlComp.GetElementsByTagName("comprobanteRetencion")[0].Attributes["version"].Value;
                        break;
                    default:
                        break;
                }
                _log.LogInfo("Xml Doc Downloaded: " + dr["claveAcceso"].ToString());
                await _docService.Update(Convert.ToInt32(dr["idDocumento"]), "DE", codDoc, versionComp, nodeAuth.OuterXml);
            }
            else
            {
                _log.LogWarning("XML of doc doesnt exists in sri");
                await _docService.Update_Error(Convert.ToInt32(dr["idDocumento"]), "NE");
            }
        }
    }
}
