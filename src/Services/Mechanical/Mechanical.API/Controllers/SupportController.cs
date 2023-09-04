using Mechanical.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Services.Common;
using Services.Common.Logs;

namespace Mechanical.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupportController : BaseApiController
    {
        public readonly ISupportService _supportService;
        public readonly LogWriter _log;
        public SupportController(ISupportService supportService, LogWriter log)
        {
            _supportService = supportService;
            _log = log;
        }

        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var parameters = new Dictionary<string, object>{
                    { "userRoleId", User.GetUserRoleId()},
                    { "json", json}
                };
                var supports = await _supportService.GetAsync(parameters);
                if (supports == null | string.IsNullOrEmpty((string)supports))
                {
                    return NoContent();
                }
                return Ok(supports);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Get: \n" + ex.ToString());
                return BadRequest("Error on get");
            }
        }
    }
}
