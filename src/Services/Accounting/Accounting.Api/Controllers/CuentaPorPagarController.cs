namespace Accounting.Api.Controllers;

public class CuentaPorPagarController(ICuentaPorPagarRepository _svc) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };

        return Ok(await _svc.GetAsync(parameters));
    }

    [HttpPost("{json}")]
    public async Task<IActionResult> Post(string json)
    {
        var parametros = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await _svc.AddAsync(parametros));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, CuentaPorPagarDto data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "idCuentaPorPagar", id },
            { "json", SqlStringParam.Sanitize(data.cuotas) }
        };
        return Ok(await _svc.UpdateAsync(parameters));
    }
}
