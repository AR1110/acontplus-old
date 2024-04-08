using Common.Core.Models;
using Common.Core.Utils;
using Contabilidad.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Services.Common;
using Services.Common.Logs;

namespace Contabilidad.API.Controllers.v1
{
    [ApiController]
    [Route("api/[controller]")]
    public class ControlCajaController : ControllerBase
    {
        private readonly LogWriter _log;
        private readonly IControlCajaService _service;

        public ControlCajaController(LogWriter log, IControlCajaService service)
        {
            _log = log;
            _service = service;
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
                if (response == null)
                {
                    return NoContent();
                };

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
                _log.LogActivity("Error en Post Control Caja " + ex.Message);
                return BadRequest("Error en Post Control Caja " + ex.Message);
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
                _log.LogActivity("Error en Put Control Caja " + ex.Message);
                return BadRequest("Error en Actualizar Control Caja " + ex.Message);
            }
        }


    }
}
