namespace Configuracion.API.Controllers;

public class EmailConfigController(IEmailConfigService emailConfigService) : BaseApiController
{
    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await emailConfigService.GetAsync(parameters));
    }

    [HttpPut]
    public async Task<IActionResult> Put(int id, [FromBody] ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idUsuarioRol", User.GetUserRoleId() },
            { "idEmailConfig", id },
            {
                "json",
                SqlStringParam.Sanitize(SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)))
            }
        };
        return Ok(await emailConfigService.UpdateAsync(parameters));
    }
}
