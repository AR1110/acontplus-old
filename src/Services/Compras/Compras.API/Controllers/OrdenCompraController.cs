using Common.Core.Models;
using Common.Core.Utils;
using Compras.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Services.Common;
using Services.Common.Logs;

namespace Compras.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdenCompraController : ControllerBase
    {
        private IConfiguration _configuration;
        private IOrdenCompraService _ordeCompraSvc;
        private LogWriter _log;

        public OrdenCompraController(IConfiguration configuration, IOrdenCompraService ordeCompraSvc, LogWriter log)
        {
            _configuration = configuration;
            _ordeCompraSvc = ordeCompraSvc;
            _log = log;

        }

        [HttpGet("Get")]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var response = await _ordeCompraSvc.GetAsync(new Dictionary<string, object> {
                    { "userRoleId", User.GetUserRoleId() },
                    { "json", SqlStringParam.Sanitize(json) }
                });
                if (response == null) { return NoContent(); };
                return Ok(new { code = "1", payload = response });
            }
            catch (Exception ex)
            {

                _log.LogActivity("Error al listar orden Compra: \n" + ex.ToString());
                return BadRequest("Error on get: " + ex.Message);
            }
        }

        [HttpPost("Insert")]
        public async Task<IActionResult> Insert(ApiRequest request)
        {
            request.UserRoleId = User.GetUserRoleId();
            try
            {
                var response = await _ordeCompraSvc.AddAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al crear orden compra: " + ex.ToString());
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetId/{id}")]
        public async Task<IActionResult> GetId(int id)
        {
            try
            {
                var response = await _ordeCompraSvc.GetByIdAsync(new Dictionary<string, object> {
                    { "userRoleId", User.GetUserRoleId() },
                    { "id", id }
                });
                if (response == null) { return NoContent(); };
                return Ok(new { code = "1", payload = response });
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al obtener datos de orden Compra: \n" + ex.ToString());
                return BadRequest("Error on get by id: " + ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, ApiRequest request)
        {
            request.UserRoleId = User.GetUserRoleId();
            try
            {
                var response = await _ordeCompraSvc.UpdateAsync(id, request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al actualizar orden compra: " + ex.ToString());
                return BadRequest(ex.Message);
            }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var parameters = new Dictionary<string, object>{
                    {"userRoleId", User.GetUserRoleId()},
                    {"id", id}
                };
                var response = await _ordeCompraSvc.DeleteAsync(parameters);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al eliminar doc. orden compra: " + ex.ToString());
                return BadRequest(ex.Message);
            }
        }

    }
}
