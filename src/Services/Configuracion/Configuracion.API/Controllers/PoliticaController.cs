using Common.Core.Models;
using Common.Core.Utils;
using DataAccess;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace Configuracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PoliticaController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        private readonly LogWriter _log;
        public PoliticaController(IConfiguration configuration, LogWriter log)
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
                await _db.SPExecute("Config.Politica_Get", true);
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al obtener datos de politica: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al obtener datos de politica");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }



        [HttpPost]
        public async Task<IActionResult> Insert(string json)
        {

            var _response = new GenericResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Config.Politica_Insert", true);
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al crear politica: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al crear politica");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, string json)
        {
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Config.Politica_Update", true);
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in Update politica: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar politica");
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
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Config.Politica_Delete", true);
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al eliminar politica: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al eliminar politica");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
