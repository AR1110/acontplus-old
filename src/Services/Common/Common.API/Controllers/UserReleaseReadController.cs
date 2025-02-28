namespace Common.API.Controllers;

public class UserReleaseReadController(IUserReleaseReadService userReleaseReadService) : BaseApiController
{
    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ApiRequest apiRequest)
    {
        apiRequest.UserRoleId = User.GetClaimValue<int>("userRoleId");
        return Ok(await userReleaseReadService.AddAsync(apiRequest));
    }
}
