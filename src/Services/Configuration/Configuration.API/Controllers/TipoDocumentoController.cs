namespace Configuration.Api.Controllers;

public class TipoDocumentoController(ITipoDocumentoService tipoDocumentoService) : BaseApiController
{
    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await tipoDocumentoService.GetAsync(parameters));
    }
}
