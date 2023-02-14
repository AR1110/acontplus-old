using ApiProveedores.Utils;
using BL.Proveedores;
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

namespace ApiProveedores.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentoRecibidoController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public DocumentoRecibidoController(IConfiguration configuration) => (_configuration) = (configuration);
        [HttpGet("Get/{idRol}/{json}")]
        public async Task<IActionResult> Get(int idRol, string json)
        {
            LogWriter _logs = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                DAO _dao = new DAO(_configuration);
                Dictionary<string, object> parameters = new Dictionary<string, object>
                {
                    {"idRol", idRol },
                    { "json", SqlValidation.ValidateSqlString(json) }
                };
                return Ok(await _dao.GetDataTable("Recepcion.Documento_Get", parameters));
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
        [HttpGet("GetId/{idRol}/{id}")]
        public async Task<IActionResult> GetId(int idRol, Guid id)
        {
            LogWriter _logs = new LogWriter(_configuration);

            GenericResponse _response = new GenericResponse();
            try
            {
                DbAccess _db = new DbAccess(_configuration);
                Dictionary<string, object> parameters = new Dictionary<string, object>();
                await _db.SPExecute("Recepcion.Documento_Get_Id");
                _db.AddDynamicParam("idRol", idRol);
                _db.AddDynamicParam("uniqueId", id);
                DataTable dt = _db.GetDataTable();
                if (dt.Rows.Count > 0)
                {
                    _response.code = "1";
                    string xmlDoc = dt.Rows[0]["xmlDoc"].ToString();
                    XmlDocument xdoc = new XmlDocument();
                    xdoc.LoadXml(xmlDoc);
                    ComprobanteElectronicoXml ceXml = new ComprobanteElectronicoXml();
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
                            { "idRol", idRol },
                            { "idComp", id },
                            { "jsonComp", JsonConvert.SerializeObject(ceXml) }
                            //,
                            //{ "jsonData", JsonConvert.SerializeObject() },
                            //{ "impuestos", JsonConvert.SerializeObject() }
                        };
                        DAO _dao = new DAO(_configuration);
                        //_dao.OnlyExec("FactElect.CompImpDetailTemp_Insert_All", parametersTemp);
                        _response.payload = ceXml;
                    }
                }
                else
                {
                    _response.code = "0";
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
        [HttpPost("{idRol}")]
        public async Task<IActionResult> Post(int idRol, IFormFile file)
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
                string path = _configuration.GetSection("ImportacionTxt").Value;
                FileData.SaveFile(path, file);
                TxtCompImp txtComp = new TxtCompImp();
                DataTable dt = new DataTable("Comprobantes");
                if (txtComp.GetDocs(FileData.GetFileByte(file), ref dt))
                {
                    Dictionary<string, object> parameters = new Dictionary<string, object>
                    {
                        { "idRol", idRol},
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
        [HttpDelete]
        public async Task<IActionResult> Delete(Guid id)
        {
            LogWriter _logs = new LogWriter(_configuration);

            try
            {
                DAO _dao = new DAO(_configuration);
                Dictionary<string, object> parameters = new Dictionary<string, object>();
                parameters.Add("uniqueId", id);
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
