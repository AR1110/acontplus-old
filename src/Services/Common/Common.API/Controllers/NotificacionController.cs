namespace Common.API.Controllers;

public class NotificacionController(INotificacionService notificacion) : BaseApiController
{
    [HttpPost]
    public async Task<IActionResult> Post(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value) },
            { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await notificacion.AddAsync(parameters));
    }
}
