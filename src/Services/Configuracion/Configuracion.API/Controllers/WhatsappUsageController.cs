using System.Reflection.Metadata;
using System.Security.Claims;
using Common.Core.Models;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Microsoft.AspNetCore.Mvc;


namespace Configuracion.API.Controllers
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
        public async Task<ActionResult<ApiResponseDeprecated>> Get(string json)
        {
            var _response = new ApiResponseDeprecated();
            var _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Config.WhatsappUsage_Get");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.FindFirstValue("idUsuarioRol")));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _response.Create(code: "0", message: "Error al obtener el uso de whatsapp"); 
               
            }
            finally
            {
                _db.Close();
            }
            return _response;
        }
        [HttpPost]
        public async Task<ActionResult<ApiResponseDeprecated>> Post([FromBody] ApiRequest parameters)
        {
            var _response = new ApiResponseDeprecated();
            var _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Config.WhatsappUsage_Insert");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.FindFirstValue("idUsuarioRol")));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(parameters.Data)));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _response.Create(code: "0", message: "Error al guardar el uso de whatsapp"); 
            }
            finally
            {
                _db.Close();
            }
            return _response;
        }
        [HttpPut]
        public async Task<ActionResult<ApiResponseDeprecated>> Put(int id, [FromBody] ApiRequest parameters)
        {
            var _response = new ApiResponseDeprecated();
            var _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Config.WhatsappUsage_Update");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.FindFirstValue("idUsuarioRol")));
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(parameters.Data)));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _response.Create(code: "0", message: "Error al actualizar el uso de whatsapp"); 
            }
            finally
            {
                _db.Close();
            }
            return _response;
        }
        [HttpDelete]
        public async Task<ActionResult<ApiResponseDeprecated>> Delete(int id)
        {
            var _response = new ApiResponseDeprecated();
            var _db = new DbAccess(_configuration);
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
            }
            finally
            {
                _db.Close();
            }
            return _response;
        }
    }
}
