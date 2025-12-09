namespace Accounting.Api.Controllers;

public class ComprobanteEgresoController : BaseApiController
{
    private readonly IComprobanteEgresoRepository _svc;

    public ComprobanteEgresoController(IComprobanteEgresoRepository service)
    {
        _svc = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await _svc.GetAsync(parameters));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] CreateComprobanteEgresoDto dto)
    {
        var jsonData = JsonSerializer.Serialize(dto);
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(jsonData) }
        };
        return Ok(await _svc.AddAsync(parameters));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Cancel(int id, string observacion)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id }, { "observacion", observacion }
        };
        var response = await _svc.DeleteAsync(parameters);
        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] UpdateComprobanteEgresoDto dto)
    {
        var jsonData = JsonSerializer.Serialize(dto);
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", SqlStringParam.Sanitize(jsonData) }
        };

        var response = await _svc.UpdateAsync(parameters);
        return Ok(response);
    }
}