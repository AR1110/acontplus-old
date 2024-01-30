using Asp.Versioning;
using Common.Core.Models;
using Common.Core.Utils;
using Contabilidad.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Services.Common;
using Services.Common.Logs;

namespace Contabilidad.API.Controllers.v2
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ApiVersion("2.0")]
    public class CuentaPorCobrarController : ControllerBase
    {
        private readonly ICuentaPorCobrarService _service;
        private readonly LogWriter _log;

        public CuentaPorCobrarController(ICuentaPorCobrarService service, LogWriter log)
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
                _log.LogActivity("Error en get Cuenta Por Cobrar " + ex.Message);
                return BadRequest("Error en get Cuenta Por Cobrar" + ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] ApiRequest data)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId()},
                    {"json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data))}
                };

                var response = await _service.GetAsync(parameters);
                if (response == null) { return NoContent(); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en Post Cuenta Por Cobrar " + ex.Message);
                return BadRequest("Error en Post Cuenta Por Cobrar" + ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] ApiRequest data)
        {
            try
            {
                var parameters = new Dictionary<string, object>
                {
                    {"userRoleId", User.GetUserRoleId()},
                    {"json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data))}
                };

                var response = await _service.GetAsync(parameters);
                if (response == null) { return NoContent(); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error en Update Cuenta Por Cobrar " + ex.Message);
                return BadRequest("Error en Update Cuenta Por Cobrar" + ex.Message);
            }
        }
    }
}
