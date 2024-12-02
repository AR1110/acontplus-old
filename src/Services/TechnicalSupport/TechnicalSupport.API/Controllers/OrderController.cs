using Common.AppSettings.Extensions;

namespace TechnicalSupport.API.Controllers;

public class OrderController : BaseApiController
{
    private readonly IMapper _mapper;
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService, IMapper mapper)
    {
        _mapper = mapper;
        _orderService = orderService;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var response = await _orderService.GetAsync(new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        });
        if (response == null) { return BadRequest("Cant get Data"); }

        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] OrderDto orderDto)
    {
        //var order = _mapper.Map<Order>(orderDto);
        var response = await _orderService.AddAsync(new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            {
                "json", SqlStringParam.Sanitize(JsonConvert.SerializeObject(orderDto,
                    new JsonSerializerSettings
                    {
                        ContractResolver =
                            new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() },
                        Formatting = Formatting.Indented
                    })
                )
            }
        });
        if (response == null) { return BadRequest("No response"); }

        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] OrderDto order)
    {
        var response = await _orderService.UpdateAsync(new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "id", id },
            {
                "json", SqlStringParam.Sanitize(JsonConvert.SerializeObject(order,
                    new JsonSerializerSettings
                    {
                        ContractResolver =
                            new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() },
                        Formatting = Formatting.Indented
                    })
                )
            }
        });
        if (response == null) { return BadRequest("No response"); }

        return Ok(response);
    }

    [HttpPut("Delivery/{id}")]
    public async Task<IActionResult> Delivery(int id, [FromBody] OrderDeliveryDto deliveryDto)
    {
        deliveryDto.UserId = User.GetUserId();

        var response = await _orderService.DeliveryAsync(deliveryDto, id);
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var response =
            await _orderService.DeleteAsync(new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() }, { "id", id }
            });
        return Ok(response);
    }
}
