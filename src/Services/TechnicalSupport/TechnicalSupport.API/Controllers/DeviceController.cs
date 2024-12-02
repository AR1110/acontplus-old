using Common.AppSettings.Extensions;

namespace TechnicalSupport.API.Controllers;

public class DeviceController : BaseApiController
{
    private readonly IDeviceService _deviceService;

    public DeviceController(IDeviceService deviceService)
    {
        _deviceService = deviceService;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await _deviceService.GetAsync(parameters);
        if (response == null)
        {
            return BadRequest("Can't Get Data");
        }

        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Device device)
    {
        device.UserId = User.GetUserId();
        var response = await _deviceService.AddAsync(device);
        if (response == null)
        {
            return BadRequest("Cant Save");
        }

        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Device device)
    {
        device.UserId = User.GetUserId();
        var response = await _deviceService.UpdateAsync(id, device);
        if (response == null)
        {
            return BadRequest("Cant Update");
        }

        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var response = await _deviceService.DeleteAsync(id, User.GetUserId());
        if (response == null)
        {
            return BadRequest("Cant Delete");
        }

        return Ok(response);
    }
}
