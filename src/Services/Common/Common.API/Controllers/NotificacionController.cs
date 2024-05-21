namespace Common.API.Controllers;

public class NotificacionController : BaseApiController
{
    private readonly INotificacionService _notificacion;

    public NotificacionController(INotificacionService notificacion)
    {
        _notificacion = notificacion;
    }


    [HttpPost]
    public async Task<IActionResult> Post(string json)
    {
        var parameters = new Dictionary<string, object>
            {
                {
                    "userRoleId", Convert.ToInt32(HttpContext.User.Claims.Single(x => x.Type == "idUsuarioRol").Value)
                },
                { "json", SqlStringParam.Sanitize(json) }
            };
        return Ok(await _notificacion.AddAsync(parameters));
    }
}
