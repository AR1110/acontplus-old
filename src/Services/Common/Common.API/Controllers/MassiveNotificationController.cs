using Common.AppSettings.Extensions;
using Common.Notifications.Entities;

namespace Common.API.Controllers;

public class MassiveNotificationController(IMassiveNotificationService massiveNotificationService) : BaseApiController
{
    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Notification notification, ICollection<IFormFile> files)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "notification", DataConverters.SerializeObjectCustom<Notification>(notification) }
        };
        return Ok(await massiveNotificationService.AddAsync(parameters));
    }
}
