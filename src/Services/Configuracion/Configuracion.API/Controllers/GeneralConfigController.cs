namespace Configuracion.API.Controllers;

public class GeneralConfigController(IGeneralConfigService generalConfigService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
            };
        var response = await generalConfigService.GetAsync(parameters);
        if (response == null) { return NoContent(); }

            ;
        return Ok(response);
    }

    [HttpPut]
    public async Task<IActionResult> Put(ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
            {
                { "userRoleId", User.GetUserRoleId() },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
            };
        var response = await generalConfigService.UpdateAsync(parameters);
        if (response == null) { return NoContent(); }
        return Ok(response);
    }
}
