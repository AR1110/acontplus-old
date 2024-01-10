using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Common.Core.Utils;
using Contabilidad.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;
using Services.Common;

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
    }
}
