using Common.Core.Models;
using DataAccess;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace Configuracion.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TipoEntidadController : ControllerBase
    {
        public readonly IConfiguration _configuration;
        private readonly LogWriter _log;
        public TipoEntidadController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _log = log;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            var _db = new DbAccess(_configuration);
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Config.TipoEntidad_Get");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", json);
                _response = _db.GetDataTableAsync();


            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al listar tipo entidad: \n" + ex.ToString());
                _response.Create("0", "Error al listar tipo entidad");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost("Insert")]
        public async Task<IActionResult> Insert(string json)
        {
            var _db = new DbAccess(_configuration);
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Config.TipoEntidad_Insert");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", json);
                _response = _db.GetDefault();


            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al crear tipo entidad: \n" + ex.ToString());
                _response.Create("0", "Error al crear tipo entidad");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut("Update/{id}")]
        public async Task<IActionResult> Update(int id, string json)
        {
            var _db = new DbAccess(_configuration);
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Config.TipoEntidad_Update");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", json);

                _response = _db.GetDefault();


            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al actualizar tipo entidad: \n" + ex.ToString());
                _response.Create("0", "Error al actualizar tipo entidad");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var _db = new DbAccess(_configuration);
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Config.TipoEntidad_Delete");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);

                _response = _db.GetDefault();


            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al eliminar tipo entidad: \n" + ex.ToString());
                _response.Create("0", "Error al eliminar tipo entidad");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        //Definir correctamente mas adelante
        [HttpGet("ListForSelect")]
        public async Task<IActionResult> ListForSelect(int id)
        {
            var _db = new DbAccess(_configuration);
            var _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Config.TipoEntidad_For_Select");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _response = _db.GetDataTableAsync();


            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al lista tipo entidad para el formulario: \n" + ex.ToString());
                _response.Create("0", "Error al lista tipo entidad para el formulario");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
