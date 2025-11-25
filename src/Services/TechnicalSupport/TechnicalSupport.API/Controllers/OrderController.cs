using Acontplus.Core.Extensions;
using OrderDto = TechnicalSupport.Domain.DTOs.OrderDto;

namespace TechnicalSupport.Api.Controllers;

public class OrderController : BaseApiController
{
    private readonly IOrderRepository _orderService;

    public OrderController(IOrderRepository orderService)
    {
        _orderService = orderService;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var response = await _orderService.GetAsync(new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        });
        return response == null ? BadRequest("Cant get Data") : Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] OrderDto orderDto)
    {
        //var order = _mapper.Map<Order>(orderDto);
        var response = await _orderService.AddAsync(new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            {
                "json", SqlStringParam.Sanitize(JsonExtensions.SerializeOptimized(orderDto)
                )
            }
        });
        return response == null ? BadRequest("No response") : Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] OrderDto order)
    {
        var response = await _orderService.UpdateAsync(new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            {
                "json", SqlStringParam.Sanitize(JsonExtensions.SerializeOptimized(order)
                )
            }
        });
        return response == null ? BadRequest("No response") : Ok(response);
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
                { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id }
            });
        return Ok(response);
    }
}
