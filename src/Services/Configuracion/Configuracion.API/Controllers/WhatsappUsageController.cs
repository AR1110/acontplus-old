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
    public class WhatsappUsageController(IConfiguration configuration) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<ApiResponseDeprecated>> Get(string json)
        {
            var response = new ApiResponseDeprecated();
            var db = new DbAccess(configuration);
            try
            {
                await db.SPExecute("Config.WhatsappUsage_Get");
                db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
                db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                response = db.GetDataSetAsync();
            }
            finally
            {
                db.Close();
            }
            return response;
        }
        [HttpPost]
        public async Task<ActionResult<ApiResponseDeprecated>> Post([FromBody] ApiRequest parameters)
        {
            var _response = new ApiResponseDeprecated();
            var _db = new DbAccess(configuration);
            try
            {
                await _db.SPExecute("Config.WhatsappUsage_Insert");
                _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(parameters.Data)));
                _response = _db.GetDefault();
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
            var _db = new DbAccess(configuration);
            try
            {
                await _db.SPExecute("Config.WhatsappUsage_Update");
                _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(parameters.Data)));
                _response = _db.GetDefault();
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
            var _db = new DbAccess(configuration);
            try
            {
                await _db.SPExecute("Config.WhatsappUsage_Delete");
                _db.AddDynamicParam("idUsuarioRol", User.GetUserRoleId());
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            finally
            {
                _db.Close();
            }
            return _response;
        }
    }
}
