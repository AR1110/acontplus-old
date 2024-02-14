using AutoMapper;
using Common.Core.Utils;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Services.Common;
using Services.Common.Logs;
using TechnicalSupport.API.Dtos;
using TechnicalSupport.API.Entities;
using TechnicalSupport.API.Interfaces;

namespace TechnicalSupport.API.Controllers
{
    public class OrderController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly IOrderService _orderService;
        private readonly LogWriter _log;
        public OrderController(IOrderService orderService, LogWriter log, IMapper mapper)
        {
            _mapper = mapper;
            _orderService = orderService;
            _log = log;
        }
        [HttpGet]
        public async Task<IActionResult> Get(string json)
        {
            try
            {
                var response = await _orderService.GetAsync(new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) } });
                if (response == null) { return BadRequest("Cant get Data"); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity($"Error on get: {json} \n {ex}");
                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] OrderDto orderDto)
        {
            try
            {
                var order = _mapper.Map<Order>(orderDto);
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
                var response = await _orderService.DeleteAsync(id);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on delete: " + ex.ToString());
                return BadRequest("Error on delete");
            }
        }
    }
}
