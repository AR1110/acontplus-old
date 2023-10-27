using System.Data;
using System.Security.Claims;
using System.Text;
using System.Xml;
using Common.Core.Models;
using Common.Core.Utils;
using Compras.API.Utils;
using Compras.Application;
using DataAccess;
using Domain.Dtos;
using FactElect.Application;
using FactElect.Core.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Services.Common.Logs;

namespace Compras.API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class DocumentoRecibidoController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        private readonly FileTxt _txtComp;
        private readonly LogWriter _log;
        public DocumentoRecibidoController(IConfiguration configuration, FileTxt txtComp, LogWriter log)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
            _txtComp = txtComp;
            _log = log;
        }

        [HttpGet("Get/{json}")]
        public async Task<IActionResult> Get(string json)
        {
            //var correlationId = HttpContext.Request.Headers["X-IdUsuarioRol"].ToString();

            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Recepcion.Documento_Get");
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al obtener los documentos recibidos: " + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener los documentos recibidos");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpGet("GetId/{id}")]
        public async Task<IActionResult> GetId(int id)
        {
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                ComprobanteElectronico ceXml = new ComprobanteElectronico();
                string sms = string.Empty;
                DataXmlComprobante _getXmlSriData = new DataXmlComprobante();
                XmlDocument xdoc = new XmlDocument();

                using (DbAccess _db = new DbAccess(_configuration))
                {
                    Dictionary<string, object> parameters = new Dictionary<string, object>();
                    await _db.SPExecute("Recepcion.Documento_Get_Id");
                    _db.AddDynamicParam("idRol", idUsuarioRol);
                    _db.AddDynamicParam("idDocumento", id);
                    DataTable dt = _db.GetDataTable();
                    if (dt.Rows.Count > 0 && dt.Columns.Contains("xmlDoc"))
                    {
                        _response.code = "1";
                        string xmlDoc = dt.Rows[0]["xmlDoc"].ToString();

                        xdoc.LoadXml(xmlDoc);


                    }
                    else
                    {
                        _response.Create(code: "0", message: "No se encontro xml");
                    }

                }
                using (DbAccess _db = new DbAccess(_configuration))
                {
                    if (!_getXmlSriData.GetData(xdoc, ref ceXml, ref sms))
                    {
                        _response.Create("0", sms);
                    }
                    else
                    {
                        if (ceXml.codDoc == "01" || ceXml.codDoc == "04")
                        {
                            await _db.SPExecute("Recepcion.Doc_Detail_Temp_Insert_All");
                            _db.AddDynamicParam("idRol", idUsuarioRol);
                            _db.AddDynamicParam("idDocumento", id);
                            _db.AddDynamicParam("jsonData", JsonConvert.SerializeObject(ceXml.detalles));
                            _db.AddDynamicParam("impuestos", JsonConvert.SerializeObject(ceXml.impuestos));
                            _db.OnlyExecute();
                        }
                        _response.payload = ceXml;
                    }
                }
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error getting data of doc: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al obtener los datos del comprobante"
                });
            }


        }
        [HttpGet("Preview/{id}")]
        public async Task<IActionResult> Preview(int id)
        {


            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

                DbAccess _db = new DbAccess(_configuration);
                Dictionary<string, object> parameters = new Dictionary<string, object>();
                await _db.SPExecute("Recepcion.Documento_Get_Id");
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("idDocumento", id);
                DataTable dt = _db.GetDataTable();
                if (dt.Rows.Count > 0 && dt.Columns.Contains("xmlDoc"))
                {
                    _response.code = "1";
                    string xmlDoc = dt.Rows[0]["xmlDoc"].ToString();
                    XmlDocument xdoc = new XmlDocument();
                    xdoc.LoadXml(xmlDoc);
                    ComprobanteElectronico ceXml = new ComprobanteElectronico();
                    string sms = string.Empty;
                    DataXmlComprobante _getXmlSriData = new DataXmlComprobante();
                    if (!_getXmlSriData.GetData(xdoc, ref ceXml, ref sms))
                    {
                        _response.Create("0", sms);
                    }
                    else
                    {
                        _response.payload = DocumentoXmlToHtml.CreateHtml(ceXml);
                    }
                }
                else
                {
                    _response.Create(code: "0", message: "No se encontro xml");
                }
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error getting data of doc: " + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener los datos del comprobante");
            }

            return Ok(_response);
        }
        //[HttpGet("Export/{id}")]
        //public async Task<IActionResult> Export(int id)
        //{
        //   
        //    ComprobanteElectronico ceXml = new ComprobanteElectronico();

        //    GenericResponse _response = new GenericResponse();
        //    try
        //    {
        //        int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
        //        DbAccess _db = new DbAccess(_configuration);
        //        Dictionary<string, object> parameters = new Dictionary<string, object>();
        //        await _db.SPExecute("Recepcion.Documento_Get_Id");
        //        _db.AddDynamicParam("idRol", idUsuarioRol);
        //        _db.AddDynamicParam("idDocumento", id);
        //        DataTable dt = _db.GetDataTable();

        //        if (dt.Rows.Count > 0 && dt.Columns.Contains("xmlDoc"))
        //        {
        //            _response.code = "1";
        //            string xmlDoc = dt.Rows[0]["xmlDoc"].ToString();
        //            XmlDocument xdoc = new XmlDocument();
        //            xdoc.LoadXml(xmlDoc);
        //            string sms = string.Empty;
        //            DataXmlComprobante _getXmlSriData = new DataXmlComprobante();
        //            if (!_getXmlSriData.GetData(xdoc, ref ceXml, ref sms))
        //            {
        //                _response.Create("0", sms);
        //            }
        //            else
        //            {
        //                //_response.payload = DocumentoXmlToHtml.CreateHtml(ceXml);
        //            }
        //        }
        //        else
        //        {
        //            _response.Create(code: "0", message: "No se encontro xml");
        //        }
        //        return File(new DocElectPdf().PdfData(ceXml), "application/pdf", "Factura_" + ceXml.infoTributaria.estab + "-" + ceXml.infoTributaria.ptoEmi + "-" + ceXml.infoTributaria.secuencial + ".pdf");
        //    }
        //    catch (Exception ex)
        //    {
        //        _logs.LogError("Error getting data of doc: " + ex.ToString());
        //        //return BadRequest(Response.StatusCode);
        //        return File(new DocElectPdf().PdfData(ceXml), "application/pdf", "report.pdf");

        //    }
        //}
        [HttpPost("Read")]
        public async Task<IActionResult> Post(IFormFile file)
        {

            GenericResponse _response = new GenericResponse();

            if (file.ContentType != "text/plain")
            {
                _response.Create("0", "Formato de archivo no soportado");
                return BadRequest(_response);
            }
            try
            {
                string path = _configuration.GetSection("ImportacionTxt").Value;
                FileData.SaveFile(path, file);
                DataTable dt = new DataTable("Comprobantes");
                dt = await _txtComp.GetDocs(FileData.GetFileByte(file));
                if (!DataValidation.DataTableIsNull(dt))
                {
                    await _db.SPExecute("Recepcion.Documento_Check_Existence");
                    _db.AddDynamicParam("json", JsonConvert.SerializeObject(dt));
                    var dtExistent = _db.GetDataTable();
                    if (dtExistent.Columns.Contains("code") && dtExistent.Rows[0].Field<string>("code") == "-1")
                    {
                        _response.Create(code: "1", payload: DataConverters.DataTableToJSON(dt));
                    }
                    else
                    {
                        if (dt.Rows.Count == dtExistent.Rows.Count)
                        {
                            _response.Create("0", "Los registros que intenta importar ya se encuentran registrados, intente con otro archivo!");
                        }
                        else
                        {
                            var diff = (from row1 in dt.AsEnumerable()
                                        join row2 in dtExistent.AsEnumerable() on new { Column1 = row1["claveAcceso"] } equals new { Column1 = row2["claveAcceso"] } into gj
                                        from subRow2 in gj.DefaultIfEmpty()
                                        where subRow2 == null
                                        select row1).ToList();
                            DataTable filteredDataTable = diff.CopyToDataTable();
                            _response.Create(code: "1", payload: DataConverters.DataTableToJSON(filteredDataTable));
                        }
                    }
                }
                else
                {
                    _response.Create("0", "No se encontraron registros para importar");
                }
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al importar el archivo: " + ex.ToString());
                _response.Create(code: "0", message: "Error al importar el archivo");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
        [HttpPost("UploadXml")]
        public async Task<IActionResult> UploadXml(string json, IFormFile file)
        {

            GenericResponse _response = new GenericResponse();

            if (file.ContentType != "text/xml")
            {
                _response.Create("0", "Formato de archivo no soportado");
                return BadRequest(_response);
            }
            try
            {
                XmlDocument xmlDocSri = new XmlDocument();
                using (MemoryStream ms = new MemoryStream())
                {
                    file.CopyTo(ms);
                    xmlDocSri.LoadXml(Encoding.UTF8.GetString(ms.ToArray()));
                }
                XmlNode nodeAuth = xmlDocSri.GetElementsByTagName("autorizacion")[0];
                XmlNode nodeComp = nodeAuth.SelectSingleNode("comprobante");
                if (nodeComp != null)
                {
                    XmlDocument xmlComp = new XmlDocument();
                    xmlComp.LoadXml(nodeComp.InnerText);

                    var declarationsI = xmlComp.ChildNodes.OfType<XmlNode>()
                                       .Where(x => x.NodeType == XmlNodeType.XmlDeclaration)
                                       .ToList();
                    declarationsI.ForEach(x => xmlComp.RemoveChild(x));




                    XmlNode node = xmlComp.GetElementsByTagName("infoTributaria")[0];
                    string versionComp = string.Empty, codDoc = string.Empty, claveAcceso = string.Empty, fechaEmision = string.Empty;
                    claveAcceso = node.SelectSingleNode("claveAcceso").InnerText;
                    codDoc = node.SelectSingleNode("codDoc").InnerText;
                    switch (codDoc)
                    {
                        case "01":
                            versionComp = xmlComp.GetElementsByTagName("factura")[0].Attributes["version"].Value;
                            fechaEmision = xmlComp.GetElementsByTagName("infoFactura")[0].SelectSingleNode("fechaEmision").InnerText;
                            break;
                        case "03":
                            versionComp = xmlComp.GetElementsByTagName("liquidacionCompra")[0].Attributes["version"].Value;
                            fechaEmision = xmlComp.GetElementsByTagName("infoLiquidacionCompra")[0].SelectSingleNode("fechaEmision").InnerText;
                            break;
                        case "04":
                            versionComp = xmlComp.GetElementsByTagName("notaCredito")[0].Attributes["version"].Value;
                            fechaEmision = xmlComp.GetElementsByTagName("infoNotaCredito")[0].SelectSingleNode("fechaEmision").InnerText;
                            break;
                        case "05":
                            versionComp = xmlComp.GetElementsByTagName("notaDebito")[0].Attributes["version"].Value;
                            fechaEmision = xmlComp.GetElementsByTagName("infoNotaDebito")[0].SelectSingleNode("fechaEmision").InnerText;
                            break;
                        case "06":
                            versionComp = xmlComp.GetElementsByTagName("guiaRemision")[0].Attributes["version"].Value;
                            fechaEmision = xmlComp.GetElementsByTagName("infoGuiaRemision")[0].SelectSingleNode("fechaEmision").InnerText;
                            break;
                        case "07":
                            versionComp = xmlComp.GetElementsByTagName("comprobanteRetencion")[0].Attributes["version"].Value;
                            fechaEmision = xmlComp.GetElementsByTagName("infoCompRetencion")[0].SelectSingleNode("fechaEmision").InnerText;
                            break;
                        default:
                            break;
                    }
                    XmlDocument xmlTosave = new XmlDocument();
                    xmlTosave.LoadXml(nodeAuth.OuterXml);



                    var declarations = xmlTosave.ChildNodes.OfType<XmlNode>()
                    .Where(x => x.NodeType == XmlNodeType.XmlDeclaration)
                    .ToList();

                    declarations.ForEach(x => xmlTosave.RemoveChild(x));

                    var root = xmlTosave.GetElementsByTagName("autorizacion")[0];

                    root.SelectSingleNode("comprobante").InnerText = xmlComp.OuterXml;


                    await _db.SPExecute("Recepcion.Documento_UploadXml");
                    _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.FindFirstValue("idUsuarioRol")));
                    _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                    _db.AddDynamicParam("codDoc", codDoc);
                    _db.AddDynamicParam("claveAcceso", claveAcceso);
                    _db.AddDynamicParam("versionComp", versionComp);
                    _db.AddDynamicParam("fechaEmision", fechaEmision);
                    _db.AddDynamicParam("XmlDoc", xmlTosave.OuterXml);
                    _response = _db.GetDefault();
                }
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al importar el archivo: " + ex.ToString());
                _response.Create(code: "0", message: "Error al importar el archivo");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost("Post")]
        public async Task<IActionResult> Post(RequestApiDto parameters)
        {

            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

                await _db.SPExecute("Recepcion.Documento_Insert", true);
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                //_db.AddDynamicParam("jsonData", SqlValidation.ValidateSqlString(data.jsonData));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(parameters.data)));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al importar el archivo: " + ex.ToString());
                _response.Create(code: "0", message: "Error al importar el archivo");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost("CheckExistenceXml")]
        public async Task<IActionResult> CheckExistenceXml(string claveAcceso)
        {

            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

                WebServiceSri _sri = new WebServiceSri(_configuration);
                var response = await _sri.CheckExistence(claveAcceso, "https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl");
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al verificar la clave acceso en el sri: " + ex.ToString());
                _response.Create(code: "0", message: "Error al verificar la clave acceso en el sri");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
        [HttpPut("Migrate")]
        public async Task<IActionResult> Migrate(RequestApiDto parameters)
        {
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Recepcion.Documento_Migrate");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("json", DataConverters.SerializeDictionary(parameters.data));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al importar el archivo: " + ex.ToString());
                _response.Create(code: "0", message: "Error al importar el archivo");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut("Put/{id}")]
        public async Task<IActionResult> Put(int id)
        {

            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Recepcion.Documento_Update");
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("idDocumento", id);
                _db.AddDynamicParam("tipo", 1);
                _db.AddDynamicParam("xmlDoc", "");
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al descargar el archivo xml: " + ex.ToString());
                _response.Create(code: "0", message: "Error al descargar el archivo xml");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Upload(int id, IFormFile file)
        {

            GenericResponse _response = new GenericResponse();

            if (file.ContentType != "text/plain")
            {
                _response.Create("0", "Formato de archivo no soportado");
                return BadRequest(_response);
            }
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

                string xmlSri = Encoding.UTF8.GetString(FileData.GetFileByte(file));
                xmlSri = xmlSri.Replace("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>", "").Replace("</xml>", ""); //DELETE UNNECESARY
                XmlDocument xmlDocSri = new XmlDocument();
                xmlDocSri.LoadXml(xmlSri);
                XmlNode nodeAuth = xmlDocSri.GetElementsByTagName("autorizacion")[0];
                XmlNode nodeComp = nodeAuth.SelectSingleNode("comprobante");
                XmlDocument xmlComp = new XmlDocument();
                xmlComp.LoadXml(nodeComp.InnerText);
                XmlNode node = xmlComp.GetElementsByTagName("infoTributaria")[0];
                string claveAccesoXml = node.SelectSingleNode("claveAcceso").InnerText;
                string codDoc = node.SelectSingleNode("codDoc").InnerText;
                await _db.SPExecute("Recepcion.Documento_Update");
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("idDocumento", id);
                _db.AddDynamicParam("tipo", 2);
                _db.AddDynamicParam("xmlDoc", xmlDocSri.OuterXml);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al importar el archivo: " + ex.ToString());
                _response.Create(code: "0", message: "Error al importar el archivo");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {

            GenericResponse _response = new GenericResponse();

            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Recepcion.Documento_Delete");
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("idDocumento", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al eliminar el archivo: " + ex.ToString());
                _response.Create(code: "0", message: "Error al eliminar el archivo");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
