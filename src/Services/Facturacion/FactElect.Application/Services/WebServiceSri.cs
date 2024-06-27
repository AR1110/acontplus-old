using System.Text;
using System.Xml;
using Common.Core.Utils;
using FactElect.Application.Models;

namespace FactElect.Application.Services;

public interface IWebServiceSri
{
    public Task<ResponseSri> CheckExistenceAsync(string claveAcceso, string url);
    public Task<ResponseSri> ReceptionAsync(string xmlSigned, string url);
    public Task<ResponseSri> AuthorizationAsync(string claveAcceso, string url);
    public Task<ResponseSri> AuthorizationLoteAsync(string claveAcceso, string url);
    public Task<string> GetXmlAsync(string claveAcceso, string url);
}

public class WebServiceSri : IWebServiceSri
{
    public async Task<ResponseSri> CheckExistenceAsync(string claveAcceso, string url)
    {
        var ResponseSri = new ResponseSri();
        try
        {
            var xml =
                $@"<soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:ec=""http://ec.gob.sri.ws.autorizacion"">                         
                            <soapenv:Body>
                                <ec:autorizacionComprobante>
                                   <claveAccesoComprobante>{claveAcceso}</claveAccesoComprobante>
                                </ec:autorizacionComprobante>
                             </soapenv:Body>
                             </soapenv:Envelope>";

            using var sriService = new HttpClient(new HttpClientHandler { UseDefaultCredentials = true });
            using var response =
                await sriService.PostAsync(url, new StringContent(xml, Encoding.UTF8, "text/xml"));
            await using var streamResponse = await response.Content.ReadAsStreamAsync();
            using var streamReader = new StreamReader(streamResponse);
            ResponseSri.xmlSri = await streamReader.ReadToEndAsync();

            var doc = new XmlDocument();
            doc.LoadXml(ResponseSri.xmlSri);

            var numeroComprobantes = doc.GetElementsByTagName("numeroComprobantes");
            if (numeroComprobantes.Count > 0)
            {
                if (numeroComprobantes[0]?.InnerText == "1")
                {
                    var xEstado = doc.GetElementsByTagName("estado");

                    switch (xEstado[0]?.InnerText)
                    {
                        case "AUTORIZADO":
                        {
                            ResponseSri.estado = xEstado[0].InnerText;
                            ResponseSri.message = "EL COMPROBANTE  YA FUE AUTORIZADO";
                            var xNumAuto = doc.GetElementsByTagName("numeroAutorizacion");
                            ResponseSri.codigoAutorizacion = xNumAuto[0]?.InnerText;
                            var xFecha = doc.GetElementsByTagName("fechaAutorizacion");
                            ResponseSri.fechaAutorizacion = xFecha[0]?.InnerText;
                            break;
                        }
                        default:
                        {
                            ResponseSri.estado = xEstado[0]?.InnerText;
                            var xmessage = doc.GetElementsByTagName("mensaje");
                            if (xmessage.Count > 0)
                            {
                                var nodos = ((XmlElement)xmessage[0])?.ChildNodes;
                                if (nodos != null)
                                {
                                    foreach (XmlElement nodo in nodos)
                                    {
                                        switch (nodo.Name)
                                        {
                                            case "identificador":
                                                ResponseSri.identificador = nodo.InnerText;
                                                break;
                                            case "mensaje":
                                                ResponseSri.message = nodo.InnerText;
                                                break;
                                            case "informacionAdicional":
                                                ResponseSri.informacionAdicional = nodo.InnerText;
                                                break;
                                            case "tipo":
                                                ResponseSri.tipo = nodo.InnerText;
                                                break;
                                        }
                                    }
                                }
                            }

                            break;
                        }
                    }
                }
                else
                {
                    ResponseSri.estado = "NO EXISTE";
                }
            }
            else
            {
                var estadoNoAuth = doc.GetElementsByTagName("estado");
                if (estadoNoAuth.Count > 0)
                {
                    ResponseSri.estado = estadoNoAuth[0]?.InnerText;
                }
            }
        }
        catch (Exception ex)
        {
            ResponseSri.estado = "ERROR";
            ResponseSri.message = "No se pudo verificar la existencia del comprobante: " + ex;
        }

        return ResponseSri;
    }

    //SRI RECEPCIONA LOS XML DE LOS COMPROBANTES 
    public async Task<ResponseSri> ReceptionAsync(string xmlSigned, string url)
    {
        var ResponseSri = new ResponseSri();
        try
        {
            var xml =
                $@"<soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:ec=""http://ec.gob.sri.ws.recepcion"">                         
                            <soapenv:Header/>                            
                            <soapenv:Body>
                               <ec:validarComprobante>
                                   <xml>{Convert.ToBase64String(Encoding.UTF8.GetBytes(xmlSigned))}</xml>
                                </ec:validarComprobante>
                             </soapenv:Body>
                             </soapenv:Envelope>";


            using var sriService = new HttpClient(new HttpClientHandler { UseDefaultCredentials = true });
            using var response =
                await sriService.PostAsync(url, new StringContent(xml, Encoding.UTF8, "text/xml"));
            await using var streamResponse = await response.Content.ReadAsStreamAsync();
            using var streamReader = new StreamReader(streamResponse);
            ResponseSri.xmlSri = await streamReader.ReadToEndAsync();

            if (DataValidation.IsXml(ResponseSri.xmlSri))
            {
                //OBTIENE DATO DEL XML RESPONSE                    
                var xdoc = new XmlDocument();
                xdoc.LoadXml(ResponseSri.xmlSri);

                var xEstado = xdoc.GetElementsByTagName("estado");
                ResponseSri.estado = xEstado[0] != null ? xEstado[0].InnerText : string.Empty;

                var identificador = xdoc.GetElementsByTagName("identificador");
                ResponseSri.identificador = identificador[0] != null ? identificador[0].InnerText : string.Empty;

                if (ResponseSri.estado == "DEVUELTA")
                {
                    xEstado = xdoc.GetElementsByTagName("mensaje");
                    var nodos = ((XmlElement)xEstado[0])?.ChildNodes;
                    if (nodos != null)
                    {
                        foreach (XmlElement nodo in nodos)
                        {
                            switch (nodo.Name)
                            {
                                case "identificador":
                                    ResponseSri.identificador = nodo.InnerText;
                                    break;
                                case "mensaje":
                                    ResponseSri.message = nodo.InnerText;
                                    break;
                                case "informacionAdicional":
                                    ResponseSri.informacionAdicional = nodo.InnerText;
                                    break;
                                case "tipo":
                                    ResponseSri.tipo = nodo.InnerText;
                                    break;
                            }
                        }
                    }
                }
            }
            else
            {
                ResponseSri.estado = "ERROR";
                ResponseSri.message = "SRI no se encuentra en línea";
            }
        }
        catch (Exception)
        {
            ResponseSri.estado = "ERROR";
            ResponseSri.message = "SRI no se encuentra en línea";
        }

        return ResponseSri;
    }

    //SRI AUTORIZA COMPROBANTE
    public async Task<ResponseSri> AuthorizationAsync(string claveAcceso, string url)
    {
        var ResponseSri = new ResponseSri();
        try
        {
            var xml =
                $@"<soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:ec=""http://ec.gob.sri.ws.autorizacion"">                         
                            <soapenv:Body>
                                <ec:autorizacionComprobante>
                                   <claveAccesoComprobante>{claveAcceso}</claveAccesoComprobante>
                                </ec:autorizacionComprobante>
                             </soapenv:Body>
                             </soapenv:Envelope>";

            using var sriService = new HttpClient(new HttpClientHandler { UseDefaultCredentials = true });
            using var response =
                await sriService.PostAsync(url, new StringContent(xml, Encoding.UTF8, "text/xml"));
            await using var streamResponse = await response.Content.ReadAsStreamAsync();
            using var streamReader = new StreamReader(streamResponse);
            ResponseSri.xmlSri = await streamReader.ReadToEndAsync();

            var doc = new XmlDocument();
            doc.LoadXml(ResponseSri.xmlSri);
            var estadoComp = doc.GetElementsByTagName("estado");

            var nlNroCompAuth = doc.GetElementsByTagName("numeroComprobantes");

            var nroComp = nlNroCompAuth[0] != null ? nlNroCompAuth[0].InnerText : string.Empty;

            if (nroComp == "0")
            {
                ResponseSri.estado = "NO AUTORIZADO";
            }
            else
            {
                ResponseSri.estado = estadoComp[0] != null ? estadoComp[0].InnerText : string.Empty;
            }

            switch (ResponseSri.estado)
            {
                case "AUTORIZADO":
                {
                    var codAutorizacion = doc.GetElementsByTagName("numeroAutorizacion");
                    ResponseSri.codigoAutorizacion = codAutorizacion[0]?.InnerText;
                    var xFecha = doc.GetElementsByTagName("fechaAutorizacion");
                    ResponseSri.fechaAutorizacion = xFecha[0]?.InnerText;
                    ResponseSri.message = "EL COMPROBANTE FUE AUTORIZADO CON ÉXITO";
                    break;
                }

                case "EN PROCESO":
                {
                    ResponseSri.message = "EL COMPROBANTE ESTA EN PROCESO";
                    break;
                }

                default:
                {
                    var xmessage = doc.GetElementsByTagName("mensaje");
                    if (xmessage.Count > 0)
                    {
                        var nodos = ((XmlElement)xmessage[0])?.ChildNodes;
                        if (nodos != null)
                        {
                            foreach (XmlElement nodo in nodos)
                            {
                                switch (nodo.Name)
                                {
                                    case "identificador":
                                        ResponseSri.identificador = nodo.InnerText;
                                        break;
                                    case "mensaje":
                                        ResponseSri.message = nodo.InnerText;
                                        break;
                                    case "informacionAdicional":
                                        ResponseSri.informacionAdicional = nodo.InnerText;
                                        break;
                                    case "tipo":
                                        ResponseSri.tipo = nodo.InnerText;
                                        break;
                                }
                            }
                        }
                    }

                    break;
                }
            }
        }
        catch (Exception ex)
        {
            _ = ex.Message;
            ResponseSri.estado = "ERROR";
            ResponseSri.message = "No se pudo autorizar el comprobante";
        }

        return ResponseSri;
    }

    //SRI AUTORIZA LOTE
    public async Task<ResponseSri> AuthorizationLoteAsync(string claveAcceso, string url)
    {
        var ResponseSri = new ResponseSri();
        try
        {
            var xml =
                $@"<soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:ec=""http://ec.gob.sri.ws.autorizacion"">                         
                            <soapenv:Body>
                                <ec:autorizacionComprobanteLote>
                                   <claveAccesoLote>{claveAcceso}</claveAccesoLote>
                                </ec:autorizacionComprobanteLote>
                             </soapenv:Body>
                             </soapenv:Envelope>";

            using var sriService = new HttpClient(new HttpClientHandler { UseDefaultCredentials = true });
            using var response = await sriService.PostAsync(url, new StringContent(xml, Encoding.UTF8, "text/xml"));
            await using var streamResponse = await response.Content.ReadAsStreamAsync();
            using var streamReader = new StreamReader(streamResponse);
            ResponseSri.xmlSri = await streamReader.ReadToEndAsync();

            var doc = new XmlDocument();
            doc.LoadXml(ResponseSri.xmlSri);
        }
        catch (Exception ex)
        {
            _ = ex.Message;
            ResponseSri.estado = "ERROR";
            ResponseSri.message = "No se pudo al autorizar el lote";
        }

        return ResponseSri;
    }

    public async Task<string> GetXmlAsync(string claveAcceso, string url)
    {
        var xmlSri = string.Empty;
        try
        {
            var xmlRequest = string.Format(
                @"<soapenv:Envelope xmlns:soapenv=""http://schemas.xmlsoap.org/soap/envelope/"" xmlns:ec=""http://ec.gob.sri.ws.autorizacion"">                         
                            <soapenv:Body>
                                <ec:autorizacionComprobante>
                                   <claveAccesoComprobante>{0}</claveAccesoComprobante>
                                </ec:autorizacionComprobante>
                             </soapenv:Body>
                             </soapenv:Envelope>", claveAcceso);

            using var sriLClient = new HttpClient(new HttpClientHandler { UseDefaultCredentials = true });
            using var response =
                await sriLClient.PostAsync(url, new StringContent(xmlRequest, Encoding.UTF8, "text/xml"));
            await using var streamResponse = await response.Content.ReadAsStreamAsync();
            using var streamReader = new StreamReader(streamResponse);
            xmlSri = await streamReader.ReadToEndAsync();
        }
        catch (Exception ex)
        {
            _ = ex.Message;
        }

        return xmlSri;
    }
}
