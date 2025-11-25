namespace TechnicalSupport.Api.Controllers;

public class DeviceController : BaseApiController
{
    private readonly IDeviceRepository _deviceService;

    public DeviceController(IDeviceRepository deviceService)
    {
        _deviceService = deviceService;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await _deviceService.GetAsync(parameters);
        return response == null ? BadRequest("Can't Get Data") : Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Device device)
    {
        device.CreatedByUserId = User.GetUserId();
        var response = await _deviceService.AddAsync(device);
        return response == null ? BadRequest("Cant Save") : Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Device device)
    {
        device.UpdatedByUserId = User.GetUserId();
        var response = await _deviceService.UpdateAsync(id, device);
        return response == null ? BadRequest("Cant Update") : Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var response = await _deviceService.DeleteAsync(id, User.GetUserId());
        return response == null ? BadRequest("Cant Delete") : Ok(response);
    }
}
