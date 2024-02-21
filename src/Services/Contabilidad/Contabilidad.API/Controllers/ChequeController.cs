 
using Microsoft.AspNetCore.Mvc;
using Services.Common.Logs;
using Services.Common;
using Contabilidad.Core.Interfaces;
using Common.Core.Utils;

namespace Contabilidad.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChequeController : ControllerBase
    {
        private readonly IChequeService _service;
        private readonly LogWriter _log;

        public ChequeController(IChequeService service, LogWriter log)
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
                _log.LogActivity("Error en get Cheque " + ex.Message);
                return BadRequest("Error en get Cheque " + ex.Message);
            }
        }
    }
}
