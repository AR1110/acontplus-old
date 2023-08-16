using DataAccess;
using Domain.Models;
using Helpers;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;
using System.Data;
using System.Text;
using System.Web;

namespace ApiFactElect.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class DocumentoElectronicoController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        public DocumentoElectronicoController(IConfiguration configuration)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            LogWriter _logs = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("FactElect.Doc_Elect_Get", true);
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _logs.LogActivity("Error al obtener la solicitud: " + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener la solicitud");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpGet("GetByStatus")]
        public async Task<IActionResult> GetByStatus(string json)
        {
            LogWriter _logs = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("FactElect.Doc_Elect_GetByStatus", true);
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _logs.LogActivity("Error al obtener la solicitud: " + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener la solicitud");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpGet("GetDataForm")]
        public async Task<IActionResult> GetDataForm()
        {
            LogWriter _logs = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

                await _db.SPExecute("FactElect.Doc_Elect_Get_Data_Form");
                _db.AddDynamicParam("idUsuarioRol ", idUsuarioRol);
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _logs.LogActivity("Error while getting data form: " + ex.ToString());
                _response.Create(code: "0", message: "Error while getting data form");
            }
            finally { _db.Close(); }
            return Ok(_response);
        }
        [HttpGet("GetXmlSri/{id}")]
        public async Task<IActionResult> GetXmlSri(int id)
        {
            LogWriter _logs = new LogWriter(_configuration);
            FileModel _response = new FileModel();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

                await _db.SPExecute("FactElect.Doc_Elect_Get_Xml");
                _db.AddDynamicParam("idUsuarioRol ", idUsuarioRol);
                _db.AddDynamicParam("id", id);
                DataTable dt = _db.GetDataTable();
                if (dt.Rows.Count > 0 && dt.Columns.Contains("xmlSri"))
                {
                    string xmlSri = string.Empty;
                    xmlSri = HttpUtility.HtmlDecode(dt.Rows[0].Field<string>("xmlSri"));
                    byte[] byteXml = Encoding.UTF8.GetBytes(xmlSri);
                    _response.Create(byteXml, "text/xml", dt.Rows[0].Field<string>("filename") + ".xml");
                    //var sms = "";
                    //await new FileUpload().Upload(_configuration.GetSection("WhatsAppFiles").Value, _response.FileName, _response.Content);
                    return File(_response.Content, _response.ContentType, _response.FileName);
                }
                return BadRequest("No se encontro xml");
            }
            catch (Exception ex)
            {
                _logs.LogActivity("Error while getting data form: " + ex.ToString());
                return BadRequest("Error al obtener el xml");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id)
        {
            LogWriter _logs = new LogWriter(_configuration);
            GenericResponse _response = new GenericResponse();
            try
            {
                int idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("FactElect.Doc_Elect_Update");
                _db.AddDynamicParam("idRol", idUsuarioRol);
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _logs.LogActivity("Error while updating doc: \n " + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar el documento");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

    }
}
