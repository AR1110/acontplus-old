using Configuracion.API.Services.Notifications;

namespace Configuracion.API.Controllers.Notifications;

public class WhatsappUsageController(IWhatsappUsageService whatsappUsageService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await whatsappUsageService.GetAsync(parameters));
    }
}
