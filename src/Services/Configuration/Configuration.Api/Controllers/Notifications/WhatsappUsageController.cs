using Configuration.Application.Interfaces.Notifications;

namespace Configuration.Api.Controllers.Notifications;

public class WhatsappUsageController(Configuration.Application.Interfaces.Notifications.IWhatsappUsageService whatsappUsageService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await whatsappUsageService.GetAsync(parameters));
    }
}
