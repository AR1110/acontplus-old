using Common.Core.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Services.Common.Extensions;
using Services.Common.Logs;
using TechnicalSupport.API.Interfaces;

namespace TechnicalSupport.API.Controllers
{
    public class OrderDetailController : BaseApiController
    {
        private readonly IOrderDetailService _orderDetailService;
        private readonly ICustomLogger _log;
        public OrderDetailController(IOrderDetailService orderDetailService, ICustomLogger log)
        {
            _orderDetailService = orderDetailService;
            _log = log;
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ApiRequest data)
        {
            try
            {
                data.UserRoleId = User.GetUserRoleId();
                var response = await _orderDetailService.AddAsync(data);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on post: \n {JsonConvert.SerializeObject(data)} \n {ex}");
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] ApiRequest data)
        {
            try
            {
                data.UserRoleId = User.GetUserRoleId();
                var response = await _orderDetailService.UpdateAsync(id, data);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on put: {id} \n {JsonConvert.SerializeObject(data)} \n {ex}");
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var response = await _orderDetailService.DeleteAsync(User.GetUserId(), id);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on delete: {id} \n {ex}");
                return BadRequest(ex.Message);
            }
        }
    }
}
