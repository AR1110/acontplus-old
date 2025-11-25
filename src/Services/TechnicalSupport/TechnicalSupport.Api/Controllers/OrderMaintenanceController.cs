namespace TechnicalSupport.Api.Controllers;

public class OrderMaintenanceController : BaseApiController
{
    private readonly IOrderMaintenanceRepository _service;

    public OrderMaintenanceController(IOrderMaintenanceRepository service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };

        var response = await _service.GetAsync(parameters);
        return response == null ? BadRequest("Can't get Data") : Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post(CreateOrderMaintenanceDto request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CreateOrderMaintenanceDto>(request)) }
        };
        var response = await _service.AddAsync(parameters);

        return response == null ? BadRequest("No response") : Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, UpdateOrderMaintenanceDto request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateOrderMaintenanceDto>(request)) }
        };

        var response = await _service.UpdateAsync(parameters);

        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var response = await _service.DeleteAsync(id);
        return Ok(response);
    }
}
