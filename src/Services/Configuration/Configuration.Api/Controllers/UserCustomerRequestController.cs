namespace Configuration.Api.Controllers;

public class UserCustomerRequestController(IUserCustomerRequestService userCustomerRequestService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
    {
        { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
    };
        var response = await userCustomerRequestService.GetAsync(parameters);
        return response == null ? NoContent() : Ok(response);
    }


    [HttpPost]
    public async Task<IActionResult> Post(CreateUserCustomerRequestDto data)
    {
        var parameters = new Dictionary<string, object>
    {
        { "userRoleId", User.GetClaimValue<int>("userRoleId") },
        { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CreateUserCustomerRequestDto>(data)) }
    };
        var response = await userCustomerRequestService.AddAsync(parameters);
        return Ok(response);
    }

    [HttpPut]
    public async Task<IActionResult> Put(UpdateUserCustomerRequestDto data)
    {
        var parameters = new Dictionary<string, object>
    {
        { "userRoleId", User.GetClaimValue<int>("userRoleId") },
        { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateUserCustomerRequestDto>(data)) }
    };
        var response = await userCustomerRequestService.UpdateAsync(parameters);
        return response == null ? NoContent() : Ok(response);
    }
}
