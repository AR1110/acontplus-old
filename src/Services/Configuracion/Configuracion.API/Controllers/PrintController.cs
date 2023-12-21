using Common.Core.Utils;
using Configuracion.API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Services.Common;
using Services.Common.Logs;

namespace Configuracion.API.Controllers
{
    public class PrintController : BaseApiController
    {
        private readonly IPrintService _print;
        private readonly LogWriter _log;
        public PrintController(LogWriter log, IPrintService print)
        {
            _print = print;
            _log = log;
        }
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var response = await _print.GetAsync(new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) } });
                if (response == null || string.IsNullOrEmpty(response)) { return NotFound(); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Get: " + json + "\n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
    }
}
