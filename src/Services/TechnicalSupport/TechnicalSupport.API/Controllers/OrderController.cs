namespace TechnicalSupport.API.Controllers
{
    public class OrderController : BaseApiController
    {
        private readonly IMapper _mapper;
        private readonly IOrderService _orderService;
        private readonly ICustomLogger _log;
        public OrderController(IOrderService orderService, ICustomLogger log, IMapper mapper)
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
                //var order = _mapper.Map<Order>(orderDto);
                var response = await _orderService.AddAsync(new Dictionary<string, object>
                {
                    { "userRoleId", User.GetUserRoleId() },
                    { "json", SqlStringParam.Sanitize(JsonConvert.SerializeObject(orderDto,
                        new JsonSerializerSettings
                        {
                            ContractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy () },
                            Formatting = Formatting.Indented
                        })
                    )}
                });
                if (response == null) { return BadRequest("No response"); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on post: " + ex.ToString());
                return BadRequest("Error on post");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] OrderDto order)
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
                if (response == null) { return BadRequest("No response"); }
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on put: " + ex.ToString());
                return BadRequest("Error on put");
            }
        }
        [HttpPut("Delivery/{id}")]
        public async Task<IActionResult> Delivery(int id)
        {
            try
            {
                var response = await _orderService.DeliveryAsync(User.GetUserId(), id);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _log.LogActivity("Error on delivery: " + ex.ToString());
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var response = await _orderService.DeleteAsync(new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "id", id } });
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
