namespace TechnicalSupport.Api.Controllers;

public class DeviceCustomerController : BaseApiController
{
    private readonly IDeviceCustomerService _service;

    public DeviceCustomerController(IDeviceCustomerService service)
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
}