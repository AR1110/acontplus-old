namespace Inventario.API.Controllers;

public class TarifaController(ITarifaService tarifaService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };

        var response = await tarifaService.GetAsync(parameters);
        return Ok(response);
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) },
            { "fromMobile", HttpContext.Items["FromMobile"] as bool? ?? false }
        };

        var response = await tarifaService.UpdateAsync(parameters);
        return Ok(response);
    }
}
