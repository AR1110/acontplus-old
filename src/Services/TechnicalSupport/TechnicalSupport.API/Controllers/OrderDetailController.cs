namespace TechnicalSupport.Api.Controllers;

public class OrderDetailController : BaseApiController
{
    private readonly IOrderDetailRepository _orderDetailService;

    public OrderDetailController(IOrderDetailRepository orderDetailService)
    {
        _orderDetailService = orderDetailService;
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] CreateOrderDetailDto data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CreateOrderDetailDto>(data)) }
        };
        var response = await _orderDetailService.AddAsync(parameters);
        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] UpdateOrderDetailDto data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateOrderDetailDto>(data)) }
        };
        var response = await _orderDetailService.UpdateAsync(id, parameters);
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var response = await _orderDetailService.DeleteAsync(User.GetUserId(), id);
        return Ok(response);
    }
}
