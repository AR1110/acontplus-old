using FactElect.Core;
using FactElect.Core.Models;
using Helpers;
using Microsoft.Extensions.Configuration;
using System.Text;
using System.Xml;

namespace FactElect.Application
{
    public sealed class WebServiceSri
    {
        private readonly IConfiguration _configuration;
        public WebServiceSri(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task<ResponseSri> CheckExistence(string claveAcceso, string url)
        {
            ResponseSri _response = new ResponseSri();
            try
            {
                string xml = string.Format(@"<soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:ec=""http://ec.gob.sri.ws.autorizacion"">                         
                            <soapenv:Body>
                                <ec:autorizacionComprobante>
                                   <claveAccesoComprobante>{0}</claveAccesoComprobante>
                                </ec:autorizacionComprobante>
                             </soapenv:Body>
                             </soapenv:Envelope>", claveAcceso);

                using (HttpClient sriService = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    using (HttpResponseMessage response = await sriService.PostAsync(url, new StringContent(xml, Encoding.UTF8, "text/xml")))
                    {
                        using (Stream streamResponse = await response.Content.ReadAsStreamAsync())
                        {
                            using (StreamReader streamReader = new StreamReader(streamResponse))
                            {
                                _response.xmlSri = streamReader.ReadToEnd();
                            }
                        }
                    }
                }

                XmlDocument doc = new XmlDocument();
                doc.LoadXml(_response.xmlSri);

                XmlNodeList numeroComprobantes = doc.GetElementsByTagName("numeroComprobantes");
                if (numeroComprobantes[0].InnerText == "1")
                {
                    XmlNodeList xEstado = doc.GetElementsByTagName("estado");

                    switch (xEstado[0].InnerText)
                    {
                        case "AUTORIZADO":
                            {
                                _response.estado = xEstado[0].InnerText;
                                _response.message = "EL COMPROBANTE  YA FUE AUTORIZADO";
                                XmlNodeList xNumAuto = doc.GetElementsByTagName("numeroAutorizacion");
                                _response.codigoAutorizacion = xNumAuto[0].InnerText;
                                XmlNodeList xFecha = doc.GetElementsByTagName("fechaAutorizacion");
                                _response.fechaAutorizacion = xFecha[0].InnerText;
                                break;
                            }
                        default:
                            {
                                _response.estado = xEstado[0].InnerText;
                                XmlNodeList xmessage = doc.GetElementsByTagName("mensaje");
                                if (xmessage.Count > 0)
                                {
                                    XmlNodeList nodos = ((XmlElement)xmessage[0]).ChildNodes;
                                    foreach (XmlElement nodo in nodos)
                                    {
                                        if (nodo.Name == "identificador") { _response.identificador = nodo.InnerText; }
                                        if (nodo.Name == "mensaje") { _response.message = nodo.InnerText; }
                                        if (nodo.Name == "informacionAdicional") { _response.informacionAdicional = nodo.InnerText; }
                                        if (nodo.Name == "tipo") { _response.tipo = nodo.InnerText; }
                                    }
                                }
                                break;
                            }
                    }
                }
                else
                {
                    _response.estado = "NO EXISTE";
                }
            }
            catch (Exception ex)
            {
                _response.estado = "ERROR";
                _response.message = "No se pudo verificar la existencia del comprobante" + ex.ToString();
            }
            return _response;
        }

        //SRI RECEPCIONA LOS XML DE LOS COMPROBANTES 
        public async Task<ResponseSri> Reception(string xmlSigned, string url)
        {
            ResponseSri _response = new ResponseSri();
            try
            {
                string xml = string.Format(@"<soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:ec=""http://ec.gob.sri.ws.recepcion"">                         
                            <soapenv:Header/>                            
                            <soapenv:Body>
                               <ec:validarComprobante>
                                   <xml>{0}</xml>
                                </ec:validarComprobante>
                             </soapenv:Body>
                             </soapenv:Envelope>", Convert.ToBase64String(Encoding.UTF8.GetBytes(xmlSigned)));


                using (HttpClient sriService = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    using (HttpResponseMessage response = await sriService.PostAsync(url, new StringContent(xml, Encoding.UTF8, "text/xml")))
                    {
                        using (Stream streamResponse = await response.Content.ReadAsStreamAsync())
                        {
                            using (StreamReader streamReader = new StreamReader(streamResponse))
                            {
                                _response.xmlSri = streamReader.ReadToEnd();
                            }
                        }
                    }
                }
                if (DataHelper.IsXml(_response.xmlSri))
                {
                    //OBTIENE DATO DEL XML RESPONSE                    
                    XmlDocument xdoc = new XmlDocument();
                    xdoc.LoadXml(_response.xmlSri);

                    XmlNodeList xEstado = xdoc.GetElementsByTagName("estado");
                    _response.estado = xEstado[0] != null ? xEstado[0].InnerText : string.Empty;

                    XmlNodeList identificador = xdoc.GetElementsByTagName("identificador");
                    _response.identificador = identificador[0] != null ? identificador[0].InnerText : string.Empty;

                    if (_response.estado == "DEVUELTA")
                    {
                        xEstado = xdoc.GetElementsByTagName("mensaje");
                        XmlNodeList nodos = ((XmlElement)xEstado[0]).ChildNodes;
                        foreach (XmlElement nodo in nodos)
                        {
                            if (nodo.Name == "identificador") { _response.identificador = nodo.InnerText; }
                            if (nodo.Name == "mensaje") { _response.message = nodo.InnerText; }
                            if (nodo.Name == "informacionAdicional") { _response.informacionAdicional = nodo.InnerText; }
                            if (nodo.Name == "tipo") { _response.tipo = nodo.InnerText; }
                        }
                    }
                }
                else
                {
                    _response.estado = "ERROR";
                    _response.message = "SRI no se encuentra en línea";
                }

            }
            catch (Exception ex)
            {
                _response.estado = "ERROR";
                _response.message = "SRI no se encuentra en línea";
            }
            return _response;
        }

        //SRI AUTORIZA COMPROBANTE
        public async Task<ResponseSri> Authorization(string claveAcceso, string url)
        {
            ResponseSri _response = new ResponseSri();
            try
            {
                string xml = string.Format(@"<soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:ec=""http://ec.gob.sri.ws.autorizacion"">                         
                            <soapenv:Body>
                                <ec:autorizacionComprobante>
                                   <claveAccesoComprobante>{0}</claveAccesoComprobante>
                                </ec:autorizacionComprobante>
                             </soapenv:Body>
                             </soapenv:Envelope>", claveAcceso);

                using (HttpClient sriService = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    using (HttpResponseMessage response = await sriService.PostAsync(url, new StringContent(xml, Encoding.UTF8, "text/xml")))
                    {
                        using (Stream streamResponse = await response.Content.ReadAsStreamAsync())
                        {
                            using (StreamReader streamReader = new StreamReader(streamResponse))
                            {
                                _response.xmlSri = streamReader.ReadToEnd();
                            }
                        }
                    }
                }
                XmlDocument doc = new XmlDocument();
                doc.LoadXml(_response.xmlSri);
                XmlNodeList estadoComp = doc.GetElementsByTagName("estado");

                XmlNodeList nlNroCompAuth = doc.GetElementsByTagName("numeroComprobantes");

                var nroComp = string.Empty;
                nroComp = nlNroCompAuth[0] != null ? nlNroCompAuth[0].InnerText : string.Empty;

                if (nroComp == "0")
                {
                    _response.estado = "NO AUTORIZADO";
                }
                else
                {
                    _response.estado = estadoComp[0] != null ? estadoComp[0].InnerText : string.Empty;
                }

                switch (_response.estado)
                {
                    case "AUTORIZADO":
                        {
                            XmlNodeList codAutorizacion = doc.GetElementsByTagName("numeroAutorizacion");
                            _response.codigoAutorizacion = codAutorizacion[0].InnerText;
                            XmlNodeList xFecha = doc.GetElementsByTagName("fechaAutorizacion");
                            _response.fechaAutorizacion = xFecha[0].InnerText;
                            _response.message = "EL COMPROBANTE FUE AUTORIZADO CON ÉXITO";
                            break;
                        }

                    case "EN PROCESO":
                        {
                            _response.message = "EL COMPROBANTE ESTA EN PROCESO";
                            break;
                        }

                    default:
                        {
                            XmlNodeList xmessage = doc.GetElementsByTagName("mensaje");
                            if (xmessage.Count > 0)
                            {
                                XmlNodeList nodos = ((XmlElement)xmessage[0]).ChildNodes;
                                foreach (XmlElement nodo in nodos)
                                {
                                    if (nodo.Name == "identificador") { _response.identificador = nodo.InnerText; }
                                    if (nodo.Name == "mensaje") { _response.message = nodo.InnerText; }
                                    if (nodo.Name == "informacionAdicional") { _response.informacionAdicional = nodo.InnerText; }
                                    if (nodo.Name == "tipo") { _response.tipo = nodo.InnerText; }
                                }
                            }

                            break;
                        }
                }
            }
            catch (Exception ex)
            {
                _ = ex.Message;
                _response.estado = "ERROR";
                _response.message = "No se pudo autorizar el comprabante";
            }
            return _response;
        }
        //SRI AUTORIZA LOTE
        public async Task<ResponseSri> AuthorizationLote(string claveAcceso, string url)
        {
            ResponseSri _response = new ResponseSri();
            try
            {
                string xml = string.Format(@"<soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:ec=""http://ec.gob.sri.ws.autorizacion"">                         
                            <soapenv:Body>
                                <ec:autorizacionComprobanteLote>
                                   <claveAccesoLote>{0}</claveAccesoLote>
                                </ec:autorizacionComprobanteLote>
                             </soapenv:Body>
                             </soapenv:Envelope>", claveAcceso);

                using (HttpClient sriService = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    using (HttpResponseMessage response = await sriService.PostAsync(url, new StringContent(xml, Encoding.UTF8, "text/xml")))
                    {
                        using (Stream streamResponse = await response.Content.ReadAsStreamAsync())
                        {
                            using (StreamReader streamReader = new StreamReader(streamResponse))
                            {
                                _response.xmlSri = streamReader.ReadToEnd();
                            }
                        }
                    }
                }
                XmlDocument doc = new XmlDocument();
                doc.LoadXml(_response.xmlSri);
            }
            catch (Exception ex)
            {
                _ = ex.Message;
                _response.estado = "ERROR";
                _response.message = "No se pudo al autorizar el lote";
            }
            return _response;
        }
        public async Task<string> GetXmlAsync(string claveAcceso, string url)
        {
            string xmlSri = string.Empty;
            try
            {
                string xmlRequest = string.Format(@"<soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:ec=""http://ec.gob.sri.ws.autorizacion"">                         
                            <soapenv:Body>
                                <ec:autorizacionComprobante>
                                   <claveAccesoComprobante>{0}</claveAccesoComprobante>
                                </ec:autorizacionComprobante>
                             </soapenv:Body>
                             </soapenv:Envelope>", claveAcceso);

                using (HttpClient sriLClient = new HttpClient(new HttpClientHandler() { UseDefaultCredentials = true }))
                {
                    using (HttpResponseMessage response = await sriLClient.PostAsync(url, new StringContent(xmlRequest, Encoding.UTF8, "text/xml")))
                    {
                        using (Stream streamResponse = await response.Content.ReadAsStreamAsync())
                        {
                            using (StreamReader streamReader = new StreamReader(streamResponse))
                            {
                                xmlSri = streamReader.ReadToEnd();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _ = ex.Message;
            }
            return xmlSri;
        }
    }
}
