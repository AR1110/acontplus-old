namespace Configuration.Api.Controllers;

public class UserRequestController(IUserRequestService userRequestService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
    {
        { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
    };
        var response = await userRequestService.GetAsync(parameters);
        return response == null ? NoContent() : Ok(response);
    }


    [HttpPost]
    public async Task<IActionResult> Post(CreateUserRequestDto data)
    {
        var parameters = new Dictionary<string, object>
    {
        { "userRoleId", User.GetClaimValue<int>("userRoleId") },
        { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CreateUserRequestDto>(data)) }
    };
        var response = await userRequestService.AddAsync(parameters);
        return Ok(response);
    }

    [HttpPut]
    public async Task<IActionResult> Put(UpdateUserRequestDto data)
    {
        var parameters = new Dictionary<string, object>
    {
        { "userRoleId", User.GetClaimValue<int>("userRoleId") },
        { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateUserRequestDto>(data)) }
    };
        var response = await userRequestService.UpdateAsync(parameters);
        return response == null ? NoContent() : Ok(response);
    }
}
