namespace Common.API.Controllers;

public class NotificacionController(INotificacionService notificacion) : BaseApiController
{
    [HttpPost]
    public async Task<IActionResult> Post(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await notificacion.AddAsync(parameters));
    }
}
