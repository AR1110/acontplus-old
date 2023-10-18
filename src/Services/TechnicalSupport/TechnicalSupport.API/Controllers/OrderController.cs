using Lib.Common.DbUtils;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Services.Common;
using Services.Common.Logs;
using TechnicalSupport.Core.Entities;
using TechnicalSupport.Core.Interfaces;

namespace TechnicalSupport.API.Controllers
{
    public class OrderController : BaseApiController
    {
        private readonly IOrderService _orderService;
        private readonly LogWriter _log;
        public OrderController(IOrderService orderService, LogWriter log)
        {
            _orderService = orderService;
            _log = log;
        }
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var response = await _orderService.GetAsync(new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) } });
                if (response == null) { return NotFound(); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on get: " + ex.ToString());
                return BadRequest("Error on get");
            }
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Order order)
        {
            try
            {
                var response = await _orderService.AddAsync(new Dictionary<string, object>
                {
                    { "userRoleId", User.GetUserRoleId() },
                    { "json", SqlStringParam.Sanitize(JsonConvert.SerializeObject(order,
                                                                                        new JsonSerializerSettings
                                                                                        {
                                                                                            ContractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy () },
                                                                                            Formatting = Formatting.Indented
                                                                                        })
                                                                                    )
                    }
                });
                if (response == null || string.IsNullOrEmpty(response)) { return BadRequest("No response"); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on post: " + ex.ToString());
                return BadRequest("Error on post");
            }
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Order order)
        {
            try
            {
                var response = await _orderService.UpdateAsync(new Dictionary<string, object>
                {
                    { "userRoleId", User.GetUserRoleId() },
                    { "id", id },
                    { "json", SqlStringParam.Sanitize(JsonConvert.SerializeObject(order,
                                                                                        new JsonSerializerSettings
                                                                                        {
                                                                                            ContractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy () },
                                                                                            Formatting = Formatting.Indented
                                                                                        })
                                                                                    )
                    }
                });
                if (response == null || string.IsNullOrEmpty(response)) { return BadRequest("No response"); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on put: " + ex.ToString());
                return BadRequest("Error on put");
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                 
                return Ok();
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on delete: " + ex.ToString());
                return BadRequest("Error on delete");
            }
        }
    }
}
