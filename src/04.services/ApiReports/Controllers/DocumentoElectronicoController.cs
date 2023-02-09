using ApiReports.Dao;
using System.Web.Http;

namespace ApiReports.Controllers
{
    public class DocumentoElectronicoController : ApiController
    {
        public string _urlRecepcion;
        public string _urlAutorizacion;
        //public ResponseSriDto _response;
        //private SignDocument _signature;
        //private WebServiceSri _sriService;
        public DocumentoElectronicoDao _de = new DocumentoElectronicoDao();
        //private string xmlSigned = "";
        //private readonly string _dirLogs = string.Empty;
        public DocumentoElectronicoController()
        {
            //_response = new ResponseSriDto();
            //_signature = new SignDocument();
            //_dirLogs = System.Configuration.ConfigurationManager.AppSettings["dirLogs"];
            //_sriService = new WebServiceSri(_dirLogs);
        }

        //[HttpPost]
        //[Route("api/DocumentoElectronico/Sign")]
        //public HttpResponseMessage SignXml(ApiParametersDto data)
        //{
        //    try
        //    {
        //        LogWritter.LogInfo(_dirLogs, "Inicia Firma comprobante");
        //        string filePath = Path.Combine(HttpRuntime.AppDomainAppPath, "Firmas\\" + data.signatureName); //OBTENER UBICACION DE LA FIRMA

        //        if (!_signature.Sign(data.xml, filePath, data.signaturePassword, ref xmlSigned)) //ENVIA A FIRMAR EL XML 
        //        {
        //            _response.estado = "ERROR";
        //            _response.message = "No se pudo firmar el documento";
        //            LogWritter.LogError(_dirLogs, "Error al firmar el comprobante: " + "\t" + data.xml);
        //            HttpResponseMessage errorSignature = Request.CreateResponse(HttpStatusCode.OK, _response);
        //            return errorSignature;
        //        }
        //        else
        //        {
        //            _response.estado = "FIRMADO";
        //            XmlDocument docXml = new XmlDocument();
        //            docXml.LoadXml(xmlSigned);

        //            XmlNodeList nClaveAcceso = docXml.GetElementsByTagName("claveAcceso");
        //            string claveAcceso = nClaveAcceso[0].InnerText;
        //            _response.xmlSri = xmlSigned;
        //            _de.UpdateAsync(claveAcceso, null, xmlSigned, _response.estado, false);
        //            LogWritter.LogInfo(_dirLogs, "Firmado comprobante: " + claveAcceso);
        //        }


        //        HttpResponseMessage responseMessage = Request.CreateResponse(HttpStatusCode.OK, _response);
        //        return responseMessage;
        //    }
        //    catch (Exception ex)
        //    {
        //        _response.estado = "ERROR";
        //        _response.message = ex.Message;
        //        LogWritter.LogError(_dirLogs, "Error al firmar el comprobante: " + _response.message);
        //        HttpResponseMessage responseMessage = Request.CreateResponse(HttpStatusCode.OK, _response);
        //        return responseMessage;
        //    }
        //}

        //[HttpPost]
        //[Route("api/DocumentoElectronico/Authorize")]
        //public async Task<HttpResponseMessage> Authorize(ApiParametersDto data)
        //{
        //    try
        //    {
        //        string filePath = Path.Combine(HttpRuntime.AppDomainAppPath, "Firmas\\" + data.signatureName); //OBTENER UBICACION DE LA FIRMA

        //        if (_signature.Sign(data.xml, filePath, data.signaturePassword, ref xmlSigned)) //ENVIA A FIRMAR EL XML 
        //        {
        //            XmlDocument docXml = new XmlDocument();
        //            docXml.LoadXml(xmlSigned);

        //            XmlNodeList nAmbiente = docXml.GetElementsByTagName("ambiente");
        //            string ambiente = nAmbiente[0].InnerText;

        //            XmlNodeList nClaveAcceso = docXml.GetElementsByTagName("claveAcceso");
        //            string claveAcceso = nClaveAcceso[0].InnerText;

        //            switch (ambiente)
        //            {
        //                case "1":
        //                    _urlRecepcion = System.Configuration.ConfigurationManager.AppSettings["urlRecepcionPruebas"];
        //                    _urlAutorizacion = System.Configuration.ConfigurationManager.AppSettings["urlAutorizacionPruebas"];
        //                    break;
        //                case "2":
        //                    _urlRecepcion = System.Configuration.ConfigurationManager.AppSettings["urlRecepcion"];
        //                    _urlAutorizacion = System.Configuration.ConfigurationManager.AppSettings["urlAutorizacion"];
        //                    break;
        //            }
        //            _response = await _sriService.Reception(xmlSigned, _urlRecepcion);
        //            if (_response.estado == "RECIBIDA")
        //            {
        //                _response = await _sriService.Authorization(claveAcceso, _urlAutorizacion);
        //                switch (_response.estado)
        //                {
        //                    case "EN PROCESO":
        //                    case "NO AUTORIZADO":
        //                        _de.InsertErrorAsync(claveAcceso, _response.estado, _response.identificador, _response.message, _response.informacionAdicional, _response.tipo, false);
        //                        break;
        //                    default:
        //                        _de.UpdateAsync(_response.codigoAutorizacion, _response.fechaAutorizacion, _response.xmlSri, _response.estado, false);
        //                        break;
        //                }
        //            }
        //            else if (_response.estado == "DEVUELTA")
        //            {
        //                _de.InsertErrorAsync(claveAcceso, _response.estado, _response.identificador, _response.message, _response.informacionAdicional, _response.tipo, false);
        //            }
        //        }
        //        else
        //        {
        //            _response.estado = "ERROR";
        //            _response.message = "No se pudo firmar el documento";
        //            HttpResponseMessage errorSignature = Request.CreateResponse(HttpStatusCode.OK, _response);
        //            return errorSignature;
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

        //[HttpPost]
        //[Route("api/DocumentoElectronico/AuthorizeWithXmlSigned")]
        //public async Task<HttpResponseMessage> AuthorizeWithXmlSigned(ApiParametersDto data)
        //{
        //    try
        //    {
        //        XmlDocument docXml = new XmlDocument();
        //        docXml.LoadXml(data.xml);

        //        XmlNodeList nAmbiente = docXml.GetElementsByTagName("ambiente");
        //        string ambiente = nAmbiente[0].InnerText;

        //        XmlNodeList nClaveAcceso = docXml.GetElementsByTagName("claveAcceso");
        //        string claveAcceso = nClaveAcceso[0].InnerText;

        //        switch (ambiente)
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
        //        if (_response.estado == "RECIBIDA")
        //        {
        //            _response = await _sriService.Authorization(claveAcceso, _urlAutorizacion);
        //            switch (_response.estado)
        //            {
        //                case "EN PROCESO":
        //                case "NO AUTORIZADO":
        //                    _de.InsertErrorAsync(claveAcceso, _response.estado, _response.identificador, _response.message, _response.informacionAdicional, _response.tipo, false);
        //                    break;
        //                default:
        //                    _de.UpdateAsync(_response.codigoAutorizacion, _response.fechaAutorizacion, _response.xmlSri, _response.estado, false);
        //                    break;
        //            }
        //        }
        //        else if (_response.estado == "DEVUELTA")
        //        {
        //            _de.InsertErrorAsync(claveAcceso, _response.estado, _response.identificador, _response.message, _response.informacionAdicional, _response.tipo, false);
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

        //[HttpPost]
        //[Route("api/DocumentoElectronico/PutAuth/{claveAcceso}/{ambiente}")]
        //public async Task<HttpResponseMessage> PutAuth(string claveAcceso, string ambiente)
        //{
        //    try
        //    {

        //        switch (ambiente)
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
        //        _response = await _sriService.CheckExistence(claveAcceso, _urlAutorizacion);
        //        if (_response.estado == "NO EXISTE")
        //        {
        //            XmlDocument xmlSriAuth = new XmlDocument();
        //            xmlSriAuth.LoadXml(_response.xmlSri);
        //            XmlNodeList nodeList = xmlSriAuth.GetElementsByTagName("comprobante");
        //            string xmlComprobante = string.Empty;
        //            foreach (XmlNode node in nodeList)
        //            {
        //                xmlComprobante = node.InnerText;
        //            }
        //            XmlDocument xmlCompLoaded = new XmlDocument();
        //            xmlCompLoaded.LoadXml(xmlComprobante);
        //            _de.UpdateAsync(_response.codigoAutorizacion, _response.fechaAutorizacion, _response.xmlSri, _response.estado, false);
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
    }
}