namespace TechnicalSupport.API.Controllers;

public class OrderDetailController : BaseApiController
{
    private readonly IOrderDetailService _orderDetailService;

    public OrderDetailController(IOrderDetailService orderDetailService)
    {
        _orderDetailService = orderDetailService;
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ApiRequest data)
    {
        data.UserRoleId = User.GetUserRoleId();
        var response = await _orderDetailService.AddAsync(data);
        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] ApiRequest data)
    {
        data.UserRoleId = User.GetUserRoleId();
        var response = await _orderDetailService.UpdateAsync(id, data);
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var response = await _orderDetailService.DeleteAsync(User.GetUserId(), id);
        return Ok(response);
    }
}
