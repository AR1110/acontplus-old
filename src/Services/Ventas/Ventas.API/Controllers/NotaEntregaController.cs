using Common.Core.Models;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Microsoft.AspNetCore.Mvc;
using Services.Common;
using Services.Common.Logs;
using Ventas.API.Interfaces;

namespace Ventas.API.Controllers
{
    public class NotaEntregaController : BaseApiController
    {
        private readonly IConfiguration _configuration;
        private readonly INotaEntregaService _notaEntrega;
        private readonly LogWriter _log;
        public NotaEntregaController(IConfiguration configuration, INotaEntregaService notaEntrega, LogWriter log)
        {
            _configuration = configuration;
            _notaEntrega = notaEntrega;
            _log = log;
        }

        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var response = await _notaEntrega.GetAsync(new Dictionary<string, object> { { "idUsuarioRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) } });
                if (response == null) { return NoContent(); };
                return Ok(new { code = "1", payload = response });
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al listar nota entregas: \n" + ex.ToString());
                return BadRequest("Error on get: " + ex.Message);
            }
        }

        [HttpGet("GetId/{id}")]
        public async Task<IActionResult> GetId(int id)
        {
            try
            {
                var response = await _notaEntrega.GetByIdAsync(new Dictionary<string, object> { { "idRol", User.GetUserRoleId() }, { "id", id } });
                if (response == null) { return NoContent(); };
                return Ok(new { code = "1", payload = response });
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al obtener datos de la nota de entrega: \n" + ex.ToString());
                return BadRequest("Error on get by id: " + ex.Message);
            }
        }

        [HttpPost("Insert")]
        public async Task<IActionResult> Insert(ApiRequest data)
        {
            var _response = new ApiResponse();
            var _db = new DbAccess(_configuration);
            try
            {
                var idUsuarioRol = User.GetUserRoleId();
                await _db.SPExecute("Ventas.NotaEntrega_Insert", true);
                _db.AddDynamicParam("userRoleId", idUsuarioRol);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al insertar nota entrega: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al insertar nota de entrega");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }

        [HttpPut("Update/{id}")]
        public async Task<IActionResult> Update(int id, ApiRequest parameters)
        {
            var _db = new DbAccess(_configuration);

            var _response = new ApiResponse();
            try
            {
                await _db.SPExecute("Ventas.NotaEntrega_Update", true);
                _db.AddDynamicParam("userRoleId", User.GetUserRoleId());
                _db.AddDynamicParam("id", id);
                _db.AddDynamicParam("json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(parameters.Data)));
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al actualizar nota entrega: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al actualizar la nota de entrega");
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
            var _response = new ApiResponse();
            try
            {
                await _db.SPExecute("Ventas.NotaEntrega_Delete");
                _db.AddDynamicParam("idRol", User.GetUserRoleId());
                _db.AddDynamicParam("id", id);
                _response = _db.GetDefault();
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al anular la nota entrega: \n" + ex.ToString());
                _response.Create(code: "0", message: "Error al anular la nota entrega");
            }
            finally
            {
                _db.Close();
            }
            return Ok(_response);
        }
    }
}
