using Common.Core.Models;
using Common.Core.Models.Almacen;
using Common.Core.Utils;
using DataAccess;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace Inventario.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedidaController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly LogWriter _log;
        public MedidaController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _log = log;
        }

        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Almacen.Medida_Get");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al listar medidas: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al listar medidas");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost("Insert")]
        public async Task<IActionResult> Insert([FromBody] Medida data)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Almacen.Medida_Insert");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("descripcion", data.descripcion);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al insertar medida: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al insertar medida");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut("Update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Medida data)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Almacen.Medida_Update");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("descripcion", data.descripcion);
                _db.AddDynamicParam("estado", data.estado);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al actualizar medida: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar medida");
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
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Almacen.Medida_Delete");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al eliminar medida: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al eliminar medida");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpGet("ListForSelect")]
        public async Task<IActionResult> ListForSelect(string json)
        {
            GenericResponse _response = new GenericResponse();
            DbAccess _db = new DbAccess(_configuration);
            try
            {
                await _db.SPExecute("Almacen.Medida_For_Select");
                _db.AddDynamicParam("idUsuarioRol", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al listar medidas para Select: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al listar medidas para Select");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

    }
}
