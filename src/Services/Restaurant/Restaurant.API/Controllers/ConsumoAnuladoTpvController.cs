using Common.Core.Models;
using Common.Core.Utils;
using Microsoft.AspNetCore.Mvc;
using Restaurant.Core.Interfaces;
using Services.Common;
using Services.Common.Logs;

namespace Restaurant.API.Controllers
{

    public class ConsumoAnuladoTpvController : BaseApiController
    {
        private readonly IConsumptionCancelledService _cancelledService;
        private readonly LogWriter _log;
        public ConsumoAnuladoTpvController(IConsumptionCancelledService cancelledService, LogWriter log)
        {
            _cancelledService = cancelledService;
            _log = log;
        }
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var response = await _cancelledService.GetAsync(new Dictionary<string, object> { { "idRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) } });
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
            var _response = new ApiResponse();
            try
            {
                var response = await _cancelledService.AddAsync(new Dictionary<string, object> { { "idRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) } });
                if (response == null || string.IsNullOrEmpty(response)) { return BadRequest("Data Not Found"); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error while saving consumo anulado tpv: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
        [HttpPut]
        public async Task<IActionResult> Put(string json)
        {
            var _response = new ApiResponse();
            try
            {
                var response = await _cancelledService.UpdateAsync(new Dictionary<string, object> { { "idRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) } });
                if (response == null || string.IsNullOrEmpty(response)) { return BadRequest("Data Not Found"); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error while updating consumo anulado tpv: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var _response = new ApiResponse();
            try
            {
                var response = await _cancelledService.DeleteAsync(new Dictionary<string, object> { { "idRol", User.GetUserRoleId() }, { "id", id } });
                if (response == null || string.IsNullOrEmpty(response)) { return BadRequest("Data Not Found"); };
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error while deleting consumo anulado tpv: \n" + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
    }
}
