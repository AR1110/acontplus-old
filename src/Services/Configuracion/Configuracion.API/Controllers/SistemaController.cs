using Common.Core.Models;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace Configuracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SistemaController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        private readonly LogWriter _log;
        public SistemaController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
            _log = log;
        }

        [HttpGet("Get/{json}")]
        public async Task<IActionResult> Get(string json)
        {

            var _response = new ApiResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Config.Sistema_Get");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al obtener datos del configuracion del sistema: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener datos de Configuracion");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }


        [HttpPut("Put")]
        public async Task<IActionResult> Put(string json)
        {

            var _response = new ApiResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Config.Sistema_Update");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al actualizar datos de Configuracion: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar datos de Configuracion");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

    }
}
