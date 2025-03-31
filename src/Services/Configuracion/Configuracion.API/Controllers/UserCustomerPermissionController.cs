namespace Configuracion.API.Controllers;

public class UserCustomerPermissionController(IUserCustomerPermissionService _svc)
    : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await _svc.GetAsync(parameters);
        if (response == null) { return NoContent(); }

        return Ok(response);
    }

    [HttpPut]
    public async Task<IActionResult> Put(ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
        };
        var response = await _svc.UpdateAsync(parameters);
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post(ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
        };
        var response = await _svc.AddAsync(parameters);
        return Ok(response);
    }
}
