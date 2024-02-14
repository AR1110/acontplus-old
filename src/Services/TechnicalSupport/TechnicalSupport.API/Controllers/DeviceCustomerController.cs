using Common.Core.Utils;
using Microsoft.AspNetCore.Mvc;
using Services.Common;
using Services.Common.Logs;
using TechnicalSupport.API.Interfaces;

namespace TechnicalSupport.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceCustomerController : ControllerBase
    {
        private IDeviceCustomerService _service;
        private readonly LogWriter _log;

        public DeviceCustomerController(IDeviceCustomerService service, LogWriter log)
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
                if (response == null) { return BadRequest("Can't Get Data"); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on Get: {json}" + ex.Message);
                return BadRequest("Error on get");
            }
        }
    }
}
