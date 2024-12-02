using Common.AppSettings.Extensions;

namespace Configuracion.API.Controllers;

public class TipoDocumentoController(ITipoDocumentoService tipoDocumentoService) : BaseApiController
{
    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await tipoDocumentoService.GetAsync(parameters));
    }
}
