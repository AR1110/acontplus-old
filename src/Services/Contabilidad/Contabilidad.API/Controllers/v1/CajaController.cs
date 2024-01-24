using Common.Core.Models;
using Common.Core.Utils;
using Contabilidad.Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;
using Services.Common;

namespace Contabilidad.API.Controllers.v1
{
    [Route("api/[controller]")]
    [ApiController]
    public class CajaController : ControllerBase
    {
        private readonly ICajaService _service;
        private readonly LogWriter _log;

        public CajaController(ICajaService service, LogWriter log)
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
                _log.LogActivity("Error en get " + ex.Message);
                return BadRequest("Error en get " + ex.Message);
            }
        } 

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ApiRequest data)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId()},
                    {"json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data))}
                };
                var response = await _service.AddAsync(parameters);
                if (response == null) { return NoContent(); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en Post " + ex.Message);
                return BadRequest("Error en Post " + ex.Message);
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
                     { "id", id },
                    {"json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data))}
                };
                var response = await _service.UpdateAsync(parameters);
                if (response == null) { return NoContent(); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en Put " + ex.Message);
                return BadRequest("Error en Actualizar " + ex.Message);
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
                var response = await _service.DeleteAsync(parameters);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error al anular caja: " + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
    }
}
