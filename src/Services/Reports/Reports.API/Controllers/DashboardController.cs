using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using Microsoft.AspNetCore.Mvc;
using Reports.API.Interfaces;
using Services.Common;
using Services.Common.Logs;

namespace Reports.API.Controllers
{
    public class DashboardController : BaseApiController
    {
        private readonly IDashboardService _dashboard;
        private readonly ITransaccionService _transaccion;
        private readonly LogWriter _log;
        public DashboardController(IDashboardService dashboard, LogWriter log, ITransaccionService transaccion)
        {
            _dashboard = dashboard;
            _log = log;
            _transaccion = transaccion;
        }
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var response = await _dashboard.GetAsync(new Dictionary<string, object> { { "idUsuarioRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json ?? "") } });
                if (response == null || string.IsNullOrEmpty(response)) { return BadRequest(); }
                return Ok(new APIResponse() { code = "1", payload = response });
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Get Statistis: \n" + ex.ToString());
                return BadRequest("Error on get Statistis");
            }
        }
    }
}
