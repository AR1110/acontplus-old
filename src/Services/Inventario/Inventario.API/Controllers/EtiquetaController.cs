using DataAccess;
using Helpers;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace Inventario.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EtiquetaController : ControllerBase
    {
        public readonly IConfiguration _configuration;
        public readonly DbAccess _db;
        private readonly LogWriter _log;
        public EtiquetaController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _db = new DbAccess(configuration);
            _log = log;
        }

        [HttpGet("Get/{json}")]
        public async Task<IActionResult> Get(string json)
        {
            
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Inventario.Etiqueta_Get");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", json);
                _response = _db.GetDataTableAsync();


            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al listar etiquetas: \n" + ex.ToString());
                _response.Create("0", "Error al listar etiquetas");
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
            
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Inventario.Etiqueta_Insert");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", json);
                _response = _db.GetDefault();


            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al crear etiquetas: \n" + ex.ToString());
                _response.Create("0", "Error al crear etiquetas");
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
            
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Inventario.Etiqueta_Update");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", json);

                _response = _db.GetDefault();


            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al actualizar etiquetas: \n" + ex.ToString());
                _response.Create("0", "Error al actualizar etiquetas");
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
            
            GenericResponse _response = new GenericResponse();
            try
            {
                await _db.SPExecute("Inventario.Etiqueta_Delete");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);

                _response = _db.GetDefault();


            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al eliminar etiquetas: \n" + ex.ToString());
                _response.Create("0", "Error al eliminar etiquetas");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
