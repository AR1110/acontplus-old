using Common.Core.Utils;
using Microsoft.AspNetCore.Mvc;
using Restaurant.Core.Interfaces;
using Services.Common;
using Services.Common.Logs;

namespace Restaurant.API.Controllers
{

    public class ConfigTpvController : BaseApiController
    {
        private readonly IConsumptionConfigService _configService;

        private readonly LogWriter _log;
        public ConfigTpvController(IConsumptionConfigService configService, LogWriter log)
        {
            _configService = configService;
            _log = log;
        }
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var response = await _configService.GetAsync(new Dictionary<string, object> { { "idRol", User.GetUserRoleId() } });
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
        public async Task<IActionResult> Post(string json)
        {
            try
            {
                var response = await _configService.AddAsync(new Dictionary<string, object> { { "idRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) } });
                if (response == null || string.IsNullOrEmpty(response)) { return BadRequest("Data Not Found"); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error while saving config tpv: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
        [HttpPut]
        public async Task<IActionResult> Put(string json)
        {
            try
            {
                var response = await _configService.UpdateAsync(new Dictionary<string, object> { { "idRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) } });
                if (response == null || string.IsNullOrEmpty(response)) { return BadRequest("Data Not Found"); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error while updating config tpv: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var response = await _configService.DeleteAsync(new Dictionary<string, object> { { "idRol", User.GetUserRoleId() }, { "id", id } });
                if (response == null || string.IsNullOrEmpty(response)) { return BadRequest("Data Not Found"); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error while updating config tpv: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
    }
}
