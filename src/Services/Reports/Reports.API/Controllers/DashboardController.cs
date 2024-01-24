using Common.Core.Models;
using Common.Core.Utils;
using Microsoft.AspNetCore.Mvc;
using Reports.Core.Interfaces;
using Services.Common;
using Services.Common.Logs;

namespace Reports.API.Controllers
{
    public class DashboardController : BaseApiController
    {
        private readonly IDashboardService _dashboard;
        private readonly LogWriter _log;
        public DashboardController(IDashboardService dashboard, LogWriter log)
        {
            _dashboard = dashboard;
            _log = log;
        }
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var response = await _dashboard.GetAsync(new Dictionary<string, object> { { "idUsuarioRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json ?? "") } });
                if (response == null || string.IsNullOrEmpty(response)) { return BadRequest(); }
                return Ok(new ApiResponse() { code = "1", payload = response });
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Get Statistis: \n" + ex.ToString());
                return BadRequest("Error on get Statistis");
            }
        }
    }
}
