using Common.Core.Utils;
using Microsoft.AspNetCore.Mvc;
using Restaurant.Core.Interfaces;
using Services.Common;
using Services.Common.Logs;

namespace Restaurant.API.Controllers
{
    public class ConsumoTpvController : BaseApiController
    {
        private readonly IConsumptionService _consumption;
        private readonly LogWriter _log;
        public ConsumoTpvController(IConsumptionService consumption, LogWriter log)
        {
            _consumption = consumption;
            _log = log;
        }
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var response = await _consumption.GetAsync(new Dictionary<string, object> { { "idRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) } });
                if (response == null) { return BadRequest("Data Not Found"); };
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
                var response = await _consumption.AddAsync(new Dictionary<string, object> { { "idRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) } });
                if (response == null || string.IsNullOrEmpty(response)) { return BadRequest("Data Not Found"); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error while saving consumo tpv: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
        [HttpPut]
        public async Task<IActionResult> Put(string json)
        {
            try
            {
                var response = await _consumption.UpdateAsync(new Dictionary<string, object> { { "idRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) } });
                if (response == null || string.IsNullOrEmpty(response)) { return BadRequest("Data Not Found"); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error while updating consumo tpv: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var response = await _consumption.DeleteAsync(new Dictionary<string, object> { { "idRol", User.GetUserRoleId() }, { "id", id } });
                if (response == null || string.IsNullOrEmpty(response)) { return BadRequest("Data Not Found"); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error while deleting consumo tpv: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("Print")]
        public async Task<IActionResult> Print(int id)
        {
            try
            {
                var response = await _consumption.PrintAsync(new Dictionary<string, object> { { "idRol", User.GetUserRoleId() }, { "id", id } });
                if (response == null || string.IsNullOrEmpty(response)) { return BadRequest("Data Not Found"); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error while to print consumo tpv: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
    }
}
