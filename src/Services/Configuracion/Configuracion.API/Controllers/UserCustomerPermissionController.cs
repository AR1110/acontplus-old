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
        if (response == null) return NoContent();

        return Ok(response);
    }

    [HttpPut]
    public async Task<IActionResult> Put(UpdateUserCustomerPermissionDto data)
    {
        var parameters = new Dictionary<string, object>
      {
        { "userRoleId", User.GetClaimValue<int>("userRoleId") },
        { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateUserCustomerPermissionDto>(data)) }
      };
        var response = await _svc.UpdateAsync(parameters);
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post(CreateUserCustomerPermissionDto data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CreateUserCustomerPermissionDto>(data)) }
        };
        var response = await _svc.AddAsync(parameters);
        return Ok(response);
    }
}