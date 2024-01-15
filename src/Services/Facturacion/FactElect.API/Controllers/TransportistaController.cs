using Common.Core.Models;
using Common.Core.Models.Logistica;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;

namespace FactElect.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransportistaController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly LogWriter _log;
        public TransportistaController(IConfiguration configuration, LogWriter log)
        {
            _configuration = configuration;
            _log = log;
        }

        /*
         const json = {
            typeList: 0, --Lista Normal 
            typeList: 1 => Para lISTAR EN SELECT HTML
            typeList: 2 => Para buscadores(autocomplete)
        }
         */
        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            var _db = new DbAccess(_configuration);
            var _response = new ApiResponse();
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Logistica.Transportista_Get");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(json));
                _response = _db.GetDataTableAsync();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al listar transportistas: " + ex.ToString());
                _response.Create(code: "0", message: "Error al listar transportistas");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPost("Insert")]
        public async Task<IActionResult> Insert([FromBody] Transportista data)
        {
            var _response = new ApiResponse();
            var _db = new DbAccess(_configuration);
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Logistica.Transportista_Insert");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("idTipoIdentificacion", data.idTipoIdentificacion);
                _db.AddDynamicParam("nroIdentificacion", data.nroIdentificacion);
                _db.AddDynamicParam("nombre", data.nombre);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error while creating transport: \n " + ex.ToString());
                _response.Create(code: "0", message: "Error al crear el transportista");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut("Update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Transportista data)
        {
            var _response = new ApiResponse();
            var _db = new DbAccess(_configuration);
            try
            {
                var idUsuarioRol = Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value);
                await _db.SPExecute("Logistica.Transportista_Update");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("nroIdentificacion", data.nroIdentificacion);
                _db.AddDynamicParam("nombre", data.nombre);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error while updating transport: \n " + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar el transportista");
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
                await _db.SPExecute("Logistica.Transportista_Delete");
                _db.AddDynamicParam("idUsuarioRol", idUsuarioRol);
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error while deleting transport: \n " + ex.ToString());
                _response.Create(code: "0", message: "Error al eliminar el transportisa");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
