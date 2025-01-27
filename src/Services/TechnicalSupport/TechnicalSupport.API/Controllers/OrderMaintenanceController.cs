namespace TechnicalSupport.API.Controllers;

public class OrderMaintenanceController : BaseApiController
{
    private readonly IOrderMaintenanceService _service;

    public OrderMaintenanceController(IOrderMaintenanceService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };

        var response = await _service.GetAsync(parameters);
        if (response == null) { return BadRequest("Can't get Data"); }

        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post(ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "json", SqlStringParam.Sanitize(JsonConvert.SerializeObject(request.Data)) }
        };
        var response = await _service.AddAsync(parameters);

        if (response == null) { return BadRequest("No response"); }

        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "id", id },
            { "json", SqlStringParam.Sanitize(JsonConvert.SerializeObject(request.Data)) }
        };

        var response = await _service.UpdateAsync(parameters);

        if (response == null) { return BadRequest("No response"); }

        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var response = await _service.DeleteAsync(id);
        return Ok(response);
    }
}
