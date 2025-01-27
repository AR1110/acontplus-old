namespace Configuracion.API.Controllers;

public class UserCustomerPermissionController(IUserCustomerPermissionService userCustomerPermissionService)
    : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await userCustomerPermissionService.GetAsync(parameters);
        if (response == null) { return NoContent(); }

        return Ok(response);
    }

    [HttpPut]
    public async Task<IActionResult> Put(ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
        };
        var response = await userCustomerPermissionService.UpdateAsync(parameters);
        return Ok(response);
    }
}
