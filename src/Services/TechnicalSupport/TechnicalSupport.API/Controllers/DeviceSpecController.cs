using Common.AppSettings.Extensions;

namespace TechnicalSupport.API.Controllers;

public class DeviceSpecController : BaseApiController
{
    private readonly IDeviceSpecService _service;

    public DeviceSpecController(IDeviceSpecService service)
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
        if (response == null)
        {
            return BadRequest("Can't Get Data");
        }

        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] DeviceSpecs data)
    {
        data.UserId = User.GetUserId();
        var response = await _service.AddAsync(data);
        if (response == null)
        {
            return BadRequest("Cant Save");
        }

        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] DeviceSpecs data)
    {
        data.UserId = User.GetUserId();
        var response = await _service.UpdateAsync(id, data);
        if (response == null)
        {
            return BadRequest("Cant Update");
        }

        return Ok(response);
    }
}
