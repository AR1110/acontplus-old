namespace Inventory.Api.Controllers;

public class PrecioMasivoController(IPrecioMasivoService precioMasivoService) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<SpResponse>> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await precioMasivoService.GetAsync(parameters);
        return response == null ? (ActionResult<SpResponse>)NoContent() : (ActionResult<SpResponse>)Ok(response);
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
