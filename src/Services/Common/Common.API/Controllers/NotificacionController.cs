using Common.AppSettings.Extensions;

namespace Common.API.Controllers;

public class NotificacionController(INotificationService notificationService) : BaseApiController
{
    [HttpPost]
    public async Task<IActionResult> Post([FromQuery] string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await notificationService.AddAsync(parameters));
    }
}
