using Common.Core.Models;

namespace Common.API.Controllers
{
    public class UserReleaseReadController(IUserReleaseReadService userReleaseReadService) : BaseApiController
    {
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ApiRequest apiRequest)
        {
            apiRequest.UserRoleId = User.GetUserRoleId();
            return Ok(await userReleaseReadService.AddAsync(apiRequest)); ;
        }
    }
}
