using Common.Core.Utils;
using Microsoft.AspNetCore.Mvc;
using Services.Common;
using Services.Common.Logs;
using TechnicalSupport.API.Entities;
using TechnicalSupport.API.Interfaces;

namespace TechnicalSupport.API.Controllers
{
    public class DeviceController : BaseApiController
    {
        private IDeviceService _deviceService;
        private readonly LogWriter _log;
        public DeviceController(LogWriter log, IDeviceService deviceService)
        {
            _log = log;
            _deviceService = deviceService;
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
                var response = await _deviceService.GetAsync(parameters);
                if (response == null) { return BadRequest("Can't Get Data"); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on Get: {json}" + ex.Message);
                return BadRequest("Error on get");
            }
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Device device)
        {
            try
            {
                device.UserId = User.GetUserId();
                var response = await _deviceService.AddAsync(device);
                if (response == null) { return BadRequest("Cant Save"); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Post: " + ex.Message);
                return BadRequest("Error on post");
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Device device)
        {
            try
            {
                device.UserId = User.GetUserId();
                var response = await _deviceService.UpdateAsync(id, device);
                if (response == null) { return BadRequest("Cant Update"); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Put: " + ex.Message);
                return BadRequest("Error on Put");
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var response = await _deviceService.DeleteAsync(id, User.GetUserId());
                if (response == null) { return BadRequest("Cant Delete"); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on Delete: " + ex.Message);
                return BadRequest("Error on Delete");
            }
        }
    }
}
