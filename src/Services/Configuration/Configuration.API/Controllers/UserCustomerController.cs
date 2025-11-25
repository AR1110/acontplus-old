namespace Configuration.Api.Controllers;

public class UserCustomerController(IUserService service) : BaseApiController
{
    private const string UserRoleClaimType = "userRoleId";

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { UserRoleClaimType, User.GetClaimValue<int>(UserRoleClaimType) }, { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await service.GetAsync(parameters);
        return response == null ? NoContent() : Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] CreateUserDto createUserDto)
    {
        var parameters = new Dictionary<string, object>
        {
            { UserRoleClaimType, User.GetClaimValue<int>(UserRoleClaimType) },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CreateUserDto>(createUserDto)) },
            { "fromMobile", HttpContext.Items["FromMobile"] as bool? ?? false }
        };
        var response = await service.AddAsync(parameters);
        return Ok(response);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Put(int id, [FromBody] UpdateUserDto updateUserDto)
    {
        var parameters = new Dictionary<string, object>
        {
            { UserRoleClaimType, User.GetClaimValue<int>(UserRoleClaimType) },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateUserDto>(updateUserDto)) },
            { "fromMobile", HttpContext.Items["FromMobile"] as bool? ?? false }
        };
        var response = await service.UpdateAsync(parameters);
        return Ok(response);
    }
}
