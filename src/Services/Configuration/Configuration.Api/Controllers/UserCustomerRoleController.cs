namespace Configuration.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserCustomerRoleController(IUserCustomerRoleService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await service.GetAsync(parameters);
        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, UpdateUserCustomerRoleDto dto)
    {
        var parameters = new Dictionary<string, object>
    {
        { "userRoleId", User.GetClaimValue<int>("userRoleId") },
        { "id", id },
        { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateUserCustomerRoleDto>(dto)) }
    };
        var response = await service.UpdateAsync(parameters);
        return Ok(response);
    }
}