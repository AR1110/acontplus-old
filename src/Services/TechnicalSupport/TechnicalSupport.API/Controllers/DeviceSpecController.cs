namespace TechnicalSupport.Api.Controllers;

public class DeviceSpecController : BaseApiController
{
    private readonly IDeviceSpecRepository _service;

    public DeviceSpecController(IDeviceSpecRepository service)
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
        return response == null ? BadRequest("Can't Get Data") : Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] DeviceSpecs data)
    {
        data.CreatedByUserId = User.GetUserId();
        var response = await _service.AddAsync(data);
        return response == null ? BadRequest("Cant Save") : Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] DeviceSpecs data)
    {
        data.UpdatedByUserId = User.GetUserId();
        var response = await _service.UpdateAsync(id, data);
        return response == null ? BadRequest("Cant Update") : Ok(response);
    }
}
