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
using Common.PdfReports;
using iTextSharp.text;

namespace ApiRecepcion.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentoRecibidoController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public DocumentoRecibidoController(IConfiguration configuration) => (_configuration) = (configuration);

        [HttpGet("Get/{json}")]
        public async Task<IActionResult> Get(string json)
        {
            //var correlationId = HttpContext.Request.Headers["X-IdUsuarioRol"].ToString();

            LogWriter _logs = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                DAO _dao = new DAO(_configuration);
                Dictionary<string, object> parameters = new Dictionary<string, object>
                {
                    {"idRol", idUsuarioRol },
                    { "json", SqlValidation.ValidateSqlString(json) }
                };
                return Ok(await _dao.GetDataSet("Recepcion.Documento_Get", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al obtener los documentos recibidos: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al obtener los documentos recibidos"
                });
            }

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
                        Dictionary<string, object> parametersTemp = new Dictionary<string, object>
                        {
                            { "idRol", idUsuarioRol },
                            { "idDocumento", id },
                            { "jsonData", JsonConvert.SerializeObject(ceXml.detalles) },
                            { "impuestos", JsonConvert.SerializeObject(ceXml.impuestos) }
                        };
                        DAO _dao = new DAO(_configuration);
                        _dao.OnlyExec("Recepcion.Doc_Detail_Temp_Insert_All", parametersTemp);
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
        [HttpGet("Export/{id}")]
        public async Task<IActionResult> Export(int id)
        {
            LogWriter _logs = new LogWriter(_configuration);
            ComprobanteElectronico ceXml = new ComprobanteElectronico();

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
                    string sms = string.Empty;
                    DataXmlComprobante _getXmlSriData = new DataXmlComprobante();
                    if (!_getXmlSriData.GetData(xdoc, ref ceXml, ref sms))
                    {
                        _response.Create("0", sms);
                    }
                    else
                    {
                        //_response.payload = DocumentoXmlToHtml.CreateHtml(ceXml);
                    }
                }
                else
                {
                    _response.Create(code: "0", message: "No se encontro xml");
                }
                return File(new DocElectPdf().PdfData(ceXml), "application/pdf", "Factura_" + ceXml.infoTributaria.estab + "-"+ ceXml.infoTributaria.ptoEmi + "-" + ceXml.infoTributaria.secuencial + ".pdf");
            }
            catch (Exception ex)
            {
                _logs.LogError("Error getting data of doc: " + ex.ToString());
                //return BadRequest(Response.StatusCode);
                return File(new DocElectPdf().PdfData(ceXml), "application/pdf", "report.pdf");

            }
        }
        [HttpPost]
        public async Task<IActionResult> Post(IFormFile file)
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
                        { "json", DataHelper.DataTableToJSON(dt) }
                    };
                    _response = await _dao.Default("Recepcion.Documento_Insert", parameters);
                }
                else
                {
                    _response.Create("0", "No se encontraron registros para importar");
                }
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al importar el archivo: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al importar el archivo"
                });
            }
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

                Dictionary<string, object> parameters = new Dictionary<string, object>();
                parameters.Add("idRol", idUsuarioRol);
                parameters.Add("idDocumento", id);
                parameters.Add("tipo", 1);
                parameters.Add("xmlDoc", ""); //no aplica -> lo procesa el worker

                return Ok(await _dao.Default("Recepcion.Documento_Update", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al descargar el archivo xml: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al descargar el archivo xml"
                });
            }
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

                Dictionary<string, object> parameters = new Dictionary<string, object>();
                parameters.Add("idRol", idUsuarioRol);
                parameters.Add("idDocumento", id);
                parameters.Add("tipo", 2);
                parameters.Add("xmlDoc", xmlDocSri.OuterXml);
              

                return Ok(await _dao.Default("Recepcion.Documento_Update", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al importar el archivo: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al importar el archivo"
                });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            LogWriter _logs = new LogWriter(_configuration);

            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

                DAO _dao = new DAO(_configuration);
                Dictionary<string, object> parameters = new Dictionary<string, object>();
                parameters.Add("idRol", idUsuarioRol);
                parameters.Add("idDocumento", id);
                return Ok(await _dao.Default("Recepcion.Documento_Delete", parameters));
            }
            catch (Exception ex)
            {
                _logs.LogError("Error al eliminar el archivo: " + ex.ToString());
                return new BadRequestObjectResult(new
                {
                    code = 0,
                    message = "Error al importar el archivo"
                });
            }
        }
    }
}
