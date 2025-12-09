namespace Configuration.Api.Controllers;

public class UsuarioPermisoController(IUsuarioPermisoService usuarioPermisoService) : BaseApiController
{
    [HttpGet("Get/{json}")]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object> { { "json", SqlStringParam.Sanitize(json) } };
        return Ok(await usuarioPermisoService.GetAsync(parameters));
    }

    [HttpPut]
    public async Task<IActionResult> Put([FromBody] UsuarioPemisoDto data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "jsonPermission", SqlStringParam.Sanitize(data.jsonPermission) }
        };
        return Ok(await usuarioPermisoService.UpdateAsync(parameters));
    }

    [HttpGet("CheckHasPermission/{json}")]
    public async Task<IActionResult> CheckHasPermission(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await usuarioPermisoService.CheckAsync(parameters));
    }
}
