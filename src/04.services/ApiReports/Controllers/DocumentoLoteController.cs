using ApiReports.Dao;
using System.Web.Http;

namespace ApiReports.Controllers
{
    public class DocumentoLoteController : ApiController
    {
        public string _urlRecepcion;
        public string _urlAutorizacion;
        //public ResponseSriDto _response;
        //private WebServiceSri _sriService;
        public DocumentoElectronicoDao _de = new DocumentoElectronicoDao();
        private readonly string _dirLogs = string.Empty;
        public DocumentoLoteController()
        {
            //_response = new ResponseSriDto();
            _dirLogs = System.Configuration.ConfigurationManager.AppSettings["dirLogs"];
            //_sriService = new WebServiceSri(_dirLogs); 
        }

        //[HttpPost]
        //[Route("api/DocumentoLote/Authorize")]
        //public async Task<HttpResponseMessage> Authorize(ApiParametersDto data)
        //{
        //    try
        //    {
        //        XmlDocument docXml = new XmlDocument();
        //        docXml.LoadXml(data.xml);
        //        XmlNodeList nClaveAcceso = docXml.GetElementsByTagName("claveAcceso");
        //        string claveAccesoLote = nClaveAcceso[0].InnerText;

        //        switch (data.ambiente)
        //        {
        //            case "1":
        //                _urlRecepcion = System.Configuration.ConfigurationManager.AppSettings["urlRecepcionPruebas"];
        //                _urlAutorizacion = System.Configuration.ConfigurationManager.AppSettings["urlAutorizacionPruebas"];
        //                break;
        //            case "2":
        //                _urlRecepcion = System.Configuration.ConfigurationManager.AppSettings["urlRecepcion"];
        //                _urlAutorizacion = System.Configuration.ConfigurationManager.AppSettings["urlAutorizacion"];
        //                break;
        //        }
        //        _response = await _sriService.Reception(data.xml, _urlRecepcion);
        //        if (_response.estado != "ERROR" && _response.estado != null)
        //        {
        //            XmlDocument xmlReception = new XmlDocument();
        //            xmlReception.LoadXml(_response.xmlSri);

        //            GetErrorMessages(xmlReception, "//comprobantes");
        //            _response = await _sriService.AuthorizationLote(claveAccesoLote, _urlAutorizacion);
        //            if (_response.estado != "ERROR" && _response.estado != null)
        //            {
        //                XmlDocument xmlSriAuth = new XmlDocument();
        //                xmlSriAuth.LoadXml(_response.xmlSri);
        //                XmlNodeList nodeList = xmlSriAuth.GetElementsByTagName("numeroComprobantesLote");
        //                string numeroComprobantesLote = nodeList[0] != null ? nodeList[0].InnerText : string.Empty;
        //                if (!string.IsNullOrEmpty(numeroComprobantesLote))
        //                {

        //                    XmlNodeList nlAuth = xmlSriAuth.GetElementsByTagName("autorizaciones");
        //                    int countAuth = 0;
        //                    if (nlAuth[0].ChildNodes.Count > 0)
        //                    {
        //                        foreach (XmlNode xnode in nlAuth[0].ChildNodes)
        //                        {
        //                            XmlNodeList nlEstado = xnode.SelectNodes("estado");
        //                            XmlNode nEstado = nlEstado[0];
        //                            string estado = nEstado.InnerText;
        //                            if (estado == "AUTORIZADO")
        //                            {
        //                                countAuth++;
        //                                XmlNodeList nlClaveAcceso = xnode.SelectNodes("numeroAutorizacion");
        //                                string claveAcceso = nlClaveAcceso[0].InnerText;
        //                                XmlNodeList nlFechaAutorizacion = xnode.SelectNodes("fechaAutorizacion");
        //                                string fechaAutorizacion = nlFechaAutorizacion[0].InnerText;
        //                                XmlNodeList nlComprobante = xnode.SelectNodes("comprobante");
        //                                string comprobante = nlComprobante[0].InnerText;
        //                                _de.UpdateAsync(claveAcceso, fechaAutorizacion, comprobante, estado, true);
        //                            }
        //                            else
        //                            {
        //                                XmlNodeList nlComprobante = xnode.SelectNodes("comprobante");
        //                                string comprobante = nlComprobante[0].InnerText;
        //                                XmlDocument xmlNoauth = new XmlDocument();
        //                                xmlNoauth.LoadXml(comprobante);

        //                                XmlNodeList nlClaveAcceso = xmlNoauth.SelectNodes("//claveAcceso");
        //                                string claveAcceso = nlClaveAcceso[0].InnerText;

        //                                XmlNodeList nlMessages = xnode.SelectNodes("mensajes");
        //                                foreach (XmlNode item in nlMessages[0].ChildNodes)
        //                                {
        //                                    XmlNodeList nIden = item.SelectNodes("identificador");
        //                                    string identificador = nIden[0].InnerText;
        //                                    XmlNodeList nlMessage = item.SelectNodes("mensaje");
        //                                    string message = nlMessage[0].InnerText;
        //                                    XmlNodeList nlIA = item.SelectNodes("informacionAdicional");
        //                                    string ia = nlIA[0].InnerText;
        //                                    XmlNodeList nlType = item.SelectNodes("tipo");
        //                                    string tipo = nlType[0].InnerText;
        //                                    _de.InsertErrorAsync(claveAcceso, estado, identificador, message, ia, tipo, false);
        //                                }
        //                            }
        //                        }
        //                    }
        //                    new DocumentoLoteDao().UpdateAsync(claveAccesoLote, numeroComprobantesLote, countAuth, countAuth > 0 ? null : _response.xmlSri);
        //                }
        //            }
        //        }
        //        else
        //        {
        //            XmlDocument doc = new XmlDocument();
        //            doc.LoadXml(_response.xmlSri);
        //            GetErrorMessages(doc, "//comprobantes");
        //            _de.InsertErrorAsync(claveAccesoLote, _response.estado, null, null, null, null, true);
        //        }
        //        HttpResponseMessage responseMessage = Request.CreateResponse(HttpStatusCode.OK, _response);
        //        return responseMessage;
        //    }
        //    catch (Exception ex)
        //    {
        //        _response.estado = "ERROR";
        //        _response.message = ex.Message;
        //        HttpResponseMessage responseMessage = Request.CreateResponse(HttpStatusCode.OK, _response);
        //        return responseMessage;
        //    }
        //}
        //public void GetErrorMessages(XmlDocument doc, string nodeMain)
        //{
        //    XmlNodeList nlComprobantes = doc.SelectNodes(nodeMain);
        //    XmlNode nComprobantes = nlComprobantes[0];

        //    if (nComprobantes.ChildNodes.Count > 0)
        //    {
        //        foreach (XmlNode xnode in nComprobantes.ChildNodes)
        //        {
        //            XmlNodeList nlClaveAcceso = xnode.SelectNodes("claveAcceso");
        //            XmlNode nclaveAcceso = nlClaveAcceso[0];
        //            string claveAcceso = nclaveAcceso.InnerText;

        //            XmlNodeList nlMessages = xnode.SelectNodes("mensajes");
        //            XmlNode nMessages = nlMessages[0];

        //            foreach (XmlNode item in nMessages.ChildNodes)
        //            {
        //                XmlNodeList nlEstado = xnode.SelectNodes("estado");
        //                string estado = nlEstado[0] != null ? nlEstado[0].InnerText : string.Empty;
        //                XmlNodeList nIden = item.SelectNodes("identificador");
        //                string identificador = nIden[0].InnerText;
        //                XmlNodeList nlMessage = item.SelectNodes("mensaje");
        //                string message = nlMessage[0].InnerText;
        //                XmlNodeList nlIA = item.SelectNodes("informacionAdicional");
        //                string ia = nlIA[0].InnerText;
        //                XmlNodeList nlType = item.SelectNodes("tipo");
        //                string tipo = nlType[0].InnerText;
        //                _de.InsertErrorAsync(claveAcceso, estado, identificador, message, ia, tipo, false);
        //            }
        //        }
        //    }
        //}
    }
}