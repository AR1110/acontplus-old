namespace Configuration.Api.Controllers;

public class UserProfileController(IUserProfileService userProfileService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object> { { "userRoleId", User.GetClaimValue<int>("userRoleId") } };
        var response = await userProfileService.GetAsync(parameters);
        return response == null ? NoContent() : Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] UserProfileDto dto)
    {
        var parameters = new Dictionary<string, object>
        {
            { "id", id }, { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UserProfileDto>(dto)) }
        };
        var response = await userProfileService.UpdateAsync(parameters);
        return response == null ? NoContent() : Ok(response);
    }
}