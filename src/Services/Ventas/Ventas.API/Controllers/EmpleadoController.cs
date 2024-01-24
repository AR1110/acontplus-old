using Common.Core.Models;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace Ventas.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmpleadoController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly LogWriter _log;
        public EmpleadoController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _log = log;
        }

        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            var _db = new DbAccess(_configuration);
            var _response = new ApiResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Ventas.Empleado_Get");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al listar empleados: " + ex.ToString());
                _response.Create(code: "0", message: "Error al listar empleados");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }



        [HttpGet("Search")]
        public async Task<IActionResult> Search(string json)
        {
            var _response = new ApiResponse();
            var _db = new DbAccess(_configuration);
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);

                await _db.SPExecute("Ventas.Empleado_Search");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error while searching data form employee: " + ex.ToString());
                _response.Create(code: "0", message: "Error al buscar empleado");
            }
            finally { _db.Close(); }
            return Ok(_response);
        }


        [HttpPost("Insert")]
        public async Task<IActionResult> Insert(string json)
        {
            var _response = new ApiResponse();
            var _db = new DbAccess(_configuration);
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Ventas.Empleado_Insert");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error while creating employee: \n " + ex.ToString());
                _response.Create(code: "0", message: "Error al crear el empleado");
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
            var _response = new ApiResponse();
            var _db = new DbAccess(_configuration);
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Ventas.Empleado_Update");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error while updating employee: \n " + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar el empleado");
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
            var _response = new ApiResponse();
            var _db = new DbAccess(_configuration);
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Ventas.Empleado_Delete");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error while deleting employee: \n " + ex.ToString());
                _response.Create(code: "0", message: "Error al eliminar el empleado");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

    }
}
