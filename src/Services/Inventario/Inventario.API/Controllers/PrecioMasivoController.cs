namespace Inventario.API.Controllers;

public class PrecioMasivoController(IPrecioMasivoService precioMasivoService) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse>> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await precioMasivoService.GetAsync(parameters);
        if (response == null) return NoContent();

        return Ok(response);
    }

    [HttpPut]
    public async Task<ActionResult> Put(PrecioMasivoDto precioMasivoDto)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<PrecioMasivoDto>(precioMasivoDto)) }
        };
        return Ok(await precioMasivoService.UpdateAsync(parameters));
    }
}