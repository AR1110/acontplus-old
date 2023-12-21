using Common.Core.Models;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Compras.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Services.Common;
using Services.Common.Logs;

namespace Compras.API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ProveedorController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DbAccess _db;
        private readonly LogWriter _log;
        private readonly IProveedorService _proveedorService;
        public ProveedorController(IConfiguration configuration, LogWriter log, IProveedorService proveedorService)
        {
            _configuration = configuration;
            _db = new DbAccess(_configuration);
            _log = log;
            _proveedorService = proveedorService;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var response = await _proveedorService.GetAsync(new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) } });
                if (response == null) { return Ok(new { code = "0", message = "No se encontro Datos" }); }
                return Ok(new { code = "1", payload = response });
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al obtener el proveedor: " + ex.ToString());
                return BadRequest(ex.Message);
            }

        }
        [HttpPost]
        public async Task<IActionResult> Post(ApiRequest request)
        {
            request.UserRoleId = User.GetUserRoleId();
            try
            {
                var response = await _proveedorService.AddAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al crear proveedor: " + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, ApiRequest request)
        {
            request.UserRoleId = User.GetUserRoleId();
            try
            {
                var response = await _proveedorService.UpdateAsync(id, request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al actualizar proveedor: " + ex.ToString());
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
                var response = await _proveedorService.DeleteAsync(parameters);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al eliminar: " + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
    }
}
