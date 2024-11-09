using Common.API.Services;

namespace Common.API.Controllers;

public class ReleaseController(IReleaseService releaseService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        return Ok(await releaseService.GetAsync(User.GetUserRoleId()));
    }
}
