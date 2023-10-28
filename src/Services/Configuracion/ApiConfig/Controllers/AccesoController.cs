using Common.Core.Models;
using Common.Core.Utils;
using DataAccess;
using Domain.Dtos;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace ApiConfig.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccesoController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        private readonly LogWriter _log;
        public AccesoController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
            _log = log;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {

            var _response = new GenericResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Config.Acceso_Get", true);
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataSetAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al obtener datos de aceso: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener datos de acceso");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut]
        public async Task<IActionResult> Put(RequestApiDto parameters)
        {
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Config.Acceso_Update", true);
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", DataConverters.SerializeDictionary(parameters.data));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in Update acceso: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar acceso");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

    }
}
