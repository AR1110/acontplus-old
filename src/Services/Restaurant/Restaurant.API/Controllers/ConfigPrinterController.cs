using Microsoft.AspNetCore.Mvc;
using Restaurant.Core.Interfaces;
using Services.Common;
using Services.Common.Logs;

namespace Restaurant.API.Controllers
{
    public class ConfigPrinterController : BaseApiController
    {
        private readonly IConsumptionConfigService _configService;
        private readonly LogWriter _log;

        public ConfigPrinterController(IConsumptionConfigService configService, LogWriter log)
        {
            _configService = configService;
            _log = log;
        }
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var response = await _configService.GetPrinterAsync(new Dictionary<string, object> { { "idRol", User.GetUserRoleId() } });
                if (response == null | string.IsNullOrEmpty(response)) { return BadRequest("Data Not Found"); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error in Get: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        public async Task<IActionResult> Post(bool estado)
        {
            try
            {
                var response = await _configService.AddPrinterAsync(new Dictionary<string, object> { { "idRol", User.GetUserRoleId() }, { "estado", estado } });
                if (response == null || string.IsNullOrEmpty(response)) { return BadRequest("Data Not Found"); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error while saving config: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
    }
}
