namespace Common.API.Controllers;
public class EmailQueueController(IEmailQueueService emailQueueService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ApiRequest apiRequest)
    {
        apiRequest.UserRoleId = User.GetClaimValue<int>("userRoleId");
        return Ok(await emailQueueService.SendAsync(apiRequest));
    }
}
