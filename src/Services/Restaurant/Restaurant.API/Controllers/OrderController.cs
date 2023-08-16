using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Restaurant.Core.Entities;
using Restaurant.Core.Interfaces;
using Services.Common;

namespace Restaurant.API.Controllers
{
    public class OrderController : BaseApiController
    {
        private readonly IOrderService _orderService;
        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
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
                var orders = await _orderService.GetAsync(parameters);
                if (orders == null | string.IsNullOrEmpty(orders)) { return NoContent(); }
                return Ok(orders);
            }
            catch (System.Exception)
            {
                return BadRequest("Error on get");
            }
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Order data)
        {
            try
            {
                var parameters = new Dictionary<string, object> {
                    { "userRoleId", User.GetUserRoleId() },
                    { "json", JsonConvert.SerializeObject(data) }
                };
                var response = await _orderService.AddAsync(parameters);
                if (response == null | string.IsNullOrEmpty(response)) { return BadRequest("No se pudo guardar"); }
                return Ok(response);
            }
            catch (System.Exception)
            {
                return BadRequest("Error On Save");
            }
        }
    }
}