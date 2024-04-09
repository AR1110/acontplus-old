using Common.Core.Models; 
using Common.Core.Utils; 
using Inventario.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Services.Common;
using Services.Common.Logs;

namespace Inventario.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransferenciaBodegaController : ControllerBase
    {
        private readonly ITransferenciaBodegaService _service;
        private readonly ICustomLogger _log;

        public TransferenciaBodegaController(ITransferenciaBodegaService service, ICustomLogger log)
        {
            _service = service;
            _log = log;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId()},
                    {"json", SqlStringParam.Sanitize(json)}
                };
                var response = await _service.GetAsync(parameters);
                if (response == null) { return NoContent(); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en Obtener Transferencias de bodegas" + ex.Message);
                return BadRequest("Error en get Transferencias de bodegas" + ex.Message);
            }
        }

        [HttpGet("GetId/{id}")]
        public async Task<IActionResult> GetId(int id)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId()},
                    {"id", id}
                };
                var response = await _service.GetIdAsync(parameters);
                if (response == null) { return NoContent(); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en Obtener Datos de Transferencias de bodegas" + ex.Message);
                return BadRequest("Error en get Data Transferencias de bodegas" + ex.Message);
            }
        }


        [HttpPost]
        public async Task<IActionResult> Post( ApiRequest data)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId()},
                    {"json", DataConverters.SerializeDictionary(data.Data)}
                };

                var response = await _service.AddAsync(parameters);
                if (response == null) { return NoContent(); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en Insertar Transferencias de bodegas" + ex.Message);
                return BadRequest("Error en Post Transferencias de bodegas" + ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] ApiRequest data)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId()},
                    {"id", id},
                    {"json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data))}
                };
                var response = await _service.UpdateAsync(parameters);
                if (response == null) { return NoContent(); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en Actualizar Transferencias de bodegas" + ex.Message);
                return BadRequest("Error en Put Transferencias de bodegas" + ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId()},
                    {"id", id}
                };
                var response = await _service.DeleteAsync(parameters);
                if (response == null) { return NoContent(); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en Eliminar Transferencias de bodegas" + ex.Message);
                return BadRequest("Error en Delete Transferencias de bodegas" + ex.Message);
            }
        }

    }
}
