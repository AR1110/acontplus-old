using Services.Common.Logs;
using DataAccess;
using Domain.Dtos;
using Helpers;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Lib.Common;

namespace ApiConfig.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WhatsappUsageController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        public WhatsappUsageController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        [HttpGet]
        public async Task<ActionResult<GenericResponse>> Get(string json)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Config.WhatsappUsage_Get");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.FindFirstValue("idUsuarioRol")));
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _response.Create(code: "0", message: "Error al obtener el uso de whatsapp");
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error on get: \n" + ex.ToString());
            }
            finally
            {
                _db.Close();
            }
            return _response;
        }
        [HttpPost]
        public async Task<ActionResult<GenericResponse>> Post([FromBody] RequestApiDto parameters)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Config.WhatsappUsage_Insert");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.FindFirstValue("idUsuarioRol")));
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(Converters.SerializeDictionary(parameters.data)));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _response.Create(code: "0", message: "Error al guardar el uso de whatsapp");
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error on post: \n" + ex.ToString());
            }
            finally
            {
                _db.Close();
            }
            return _response;
        }
        [HttpPut]
        public async Task<ActionResult<GenericResponse>> Put(int id, [FromBody] RequestApiDto parameters)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Config.WhatsappUsage_Update");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.FindFirstValue("idUsuarioRol")));
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", SqlValidation.ValidateSqlString(Converters.SerializeDictionary(parameters.data)));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _response.Create(code: "0", message: "Error al actualizar el uso de whatsapp");
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error on put: \n" + ex.ToString());
            }
            finally
            {
                _db.Close();
            }
            return _response;
        }
        [HttpDelete]
        public async Task<ActionResult<GenericResponse>> Delete(int id)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Config.WhatsappUsage_Delete");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.FindFirstValue("idUsuarioRol")));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _response.Create(code: "0", message: "Error al eliminar el uso de whatsapp");
                LogWriter _log = new LogWriter(_configuration);
                _log.LogError("Error on delete: \n" + ex.ToString());
            }
            finally
            {
                _db.Close();
            }
            return _response;
        }
    }
}
