namespace Contabilidad.API.Controllers;

public class CuentaPorCobrarController(ICuentaPorCobrarService cuentaPorCobrarService)
    : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await cuentaPorCobrarService.GetAsync(parameters);
        if (response == null) return NoContent();

        return Ok(response);
    }

    // Cuotas
    [HttpPut("Update/Cuota")]
    public async Task<IActionResult> Update([FromBody] ApiRequest paremeter)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", DataConverters.SerializeDictionary(paremeter.Data) }
        };
        return Ok(await cuentaPorCobrarService.UpdateCuotaAsync(parameters));
    }

    // Credito Garante
    [HttpPost("Insert/Garante")]
    public async Task<IActionResult> Insert([FromBody] ApiRequest paremeter)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", DataConverters.SerializeDictionary(paremeter.Data) }
        };
        return Ok(await cuentaPorCobrarService.AddGaranteAsync(parameters));
    }
}