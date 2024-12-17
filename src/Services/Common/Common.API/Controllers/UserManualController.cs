using Common.API.Services;
using Common.AppSettings.Extensions;

namespace Common.API.Controllers;

public class UserManualController(IUserManualService userManualService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await userManualService.GetAsync(parameters));
    }
}
