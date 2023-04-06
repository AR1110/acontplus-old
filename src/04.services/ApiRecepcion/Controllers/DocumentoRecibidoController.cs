using ApiRecepcion.Utils;
using BL.Recepcion;
using Common.Logs;
using Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Xml;
using DataAccess;
using BL.FactElect;
using Domain.FactElect;
using Newtonsoft.Json;
using System.Text;

namespace ApiRecepcion.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentoRecibidoController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        public DocumentoRecibidoController(IConfiguration configuration)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
        }

        [HttpGet("Get/{json}")]
        public async Task<IActionResult> Get(string json)
        {
            //var correlationId = HttpContext.Request.Headers["X-IdUsuarioRol"].ToString();
            LogWriter _logs = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Recepcion.Documento_Get");
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al obtener los documentos recibidos: " + ex.ToString());
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
            LogWriter _logs = new LogWriter(_configuration);

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
                else
                {
                    _response.Create(code: "0", message: "No se encontro xml");
                }
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _logs.LogError("Error getting data of doc: " + ex.ToString());
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
            LogWriter _logs = new LogWriter(_configuration);

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
                _logs.LogError("Error getting data of doc: " + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener los datos del comprobante");
            }
            return Ok(_response);
        }
        //[HttpGet("Export/{id}")]
        //public async Task<IActionResult> Export(int id)
        //{
        //    LogWriter _logs = new LogWriter(_configuration);
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
        [HttpPost("{jsonData}")]
        public async Task<IActionResult> Post(string jsonData, IFormFile file)
        {
            LogWriter _logs = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            DAO _dao = new DAO(_configuration);
            if (file.ContentType != "text/plain")
            {
                _response.Create("0", "Formato de archivo no soportado");
                return BadRequest(_response);
            }
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

                string path = _configuration.GetSection("ImportacionTxt").Value;
                FileData.SaveFile(path, file);
                FileTxt txtComp = new FileTxt();
                DataTable dt = new DataTable("Comprobantes");
                if (txtComp.GetDocs(FileData.GetFileByte(file), ref dt))
                {
                    Dictionary<string, object> parameters = new Dictionary<string, object>
                    {
                        { "idRol", idUsuarioRol},
                        { "jsonData", jsonData },
                        { "json", DataHelper.DataTableToJSON(dt) }
                    };
                    _response = await _dao.Default("Recepcion.Documento_Insert", parameters);
                }
                else
                {
                    _response.Create("0", "No se encontraron registros para importar");
                }
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al importar el archivo: " + ex.ToString());
                _response.Create(code: "0", message: "Error al importar el archivo");
            }
            return Ok(_response);
        }

        [HttpPut("Put/{id}")]
        public async Task<IActionResult> Put(int id)
        {
            LogWriter _logs = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            DAO _dao = new DAO(_configuration);
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

                Dictionary<string, object> parameters = new Dictionary<string, object>
                {
                    { "idRol", idUsuarioRol },
                    { "idDocumento", id },
                    { "tipo", 1 },
                    { "xmlDoc", "" } //no aplica -> lo procesa el worker
                };

                _response = await _dao.Default("Recepcion.Documento_Update", parameters);
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al descargar el archivo xml: " + ex.ToString());
                _response.Create(code: "0", message: "Error al descargar el archivo xml");
            }
            return Ok(_response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Upload(int id, IFormFile file)
        {
            LogWriter _logs = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            DAO _dao = new DAO(_configuration);
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

                Dictionary<string, object> parameters = new Dictionary<string, object>
                {
                    { "idRol", idUsuarioRol },
                    { "idDocumento", id },
                    { "tipo", 2 },
                    { "xmlDoc", xmlDocSri.OuterXml }
                };

                _response = await _dao.Default("Recepcion.Documento_Update", parameters);
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al importar el archivo: " + ex.ToString());
                _response.Create(code: "0", message: "Error al importar el archivo");
            }
            return Ok(_response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            LogWriter _logs = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();

            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

                DAO _dao = new DAO(_configuration);
                Dictionary<string, object> parameters = new Dictionary<string, object>
                {
                    { "idRol", idUsuarioRol },
                    { "idDocumento", id }
                };
                _response = await _dao.Default("Recepcion.Documento_Delete", parameters);
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al eliminar el archivo: " + ex.ToString());
                _response.Create(code: "0", message: "Error al eliminar el archivo");
            }
            return Ok(_response);
        }
    }
}
