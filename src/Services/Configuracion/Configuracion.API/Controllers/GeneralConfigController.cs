namespace Configuracion.API.Controllers;

public class GeneralConfigController(IGeneralConfigService generalConfigService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await generalConfigService.GetAsync(parameters));
    }

    [HttpPut]
    public async Task<IActionResult> Put(ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
        };

        return Ok(await generalConfigService.UpdateAsync(parameters));
    }
}