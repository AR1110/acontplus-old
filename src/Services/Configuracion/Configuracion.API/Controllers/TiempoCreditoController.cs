using Common.Core.Models;
using Common.Infrastructure.Repository;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace Configuracion.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TiempoCreditoController : ControllerBase
    {
        public readonly IConfiguration _configuration;
        private readonly LogWriter _log;
        public TiempoCreditoController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _log = log;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            var _db = new DbAccess(_configuration);
            var _response = new ApiResponse();
            try
            {
                await _db.SPExecute("Config.TiempoCredito_Get");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", json);
                _response = _db.GetDataTableAsync();


            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al listar tiempo credito: \n" + ex.ToString());
                _response.Create("0", "Error al listar tiempo credito");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost()]
        public async Task<IActionResult> Post(string json)
        {
            var _db = new DbAccess(_configuration);
            var _response = new ApiResponse();
            try
            {
                await _db.SPExecute("Config.TiempoCredito_Insert");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", json);
                _response = _db.GetDefault();


            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al crear tiempo creditos: \n" + ex.ToString());
                _response.Create("0", "Error al crear tiempo creditos");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, string json)
        {
            var _db = new DbAccess(_configuration);
            var _response = new ApiResponse();
            try
            {
                await _db.SPExecute("Config.TiempoCredito_Update");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", json);

                _response = _db.GetDefault();


            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al actualizar tiempo creditos: \n" + ex.ToString());
                _response.Create("0", "Error al actualizar tiempo creditos");
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
            var _db = new DbAccess(_configuration);
            var _response = new ApiResponse();
            try
            {
                await _db.SPExecute("Config.TiempoCredito_Delete");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);

                _response = _db.GetDefault();


            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al eliminar tiempo creditos: \n" + ex.ToString());
                _response.Create("0", "Error al eliminar tiempo creditos");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

    }
}
