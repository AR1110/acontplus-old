namespace Accounting.Api.Controllers;

public class CuentaPorCobrarController(ICuentaPorCobrarRepository cuentaPorCobrarService)
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
        return response == null ? NoContent() : Ok(response);
    }

    // Cuotas
    [HttpPut("Update/Cuota")]
    public async Task<IActionResult> Update([FromBody] CuotaPorCobrarUpdateParamsDto parameter)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", DataConverters.SerializeObjectCustom<CuotaPorCobrarUpdateParamsDto>(parameter) }
        };
        return Ok(await cuentaPorCobrarService.UpdateCuotaAsync(parameters));
    }

    // Credito Garante
    [HttpPost("Insert/Garante")]
    public async Task<IActionResult> Insert([FromBody] CreateCreditoGaranteDto parameter)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", DataConverters.SerializeObjectCustom<CreateCreditoGaranteDto>(parameter) }
        };
        return Ok(await cuentaPorCobrarService.AddGaranteAsync(parameters));
    }
}
