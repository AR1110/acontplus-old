namespace Accounting.Api.Controllers;

public class ComprobanteIngresoController(IComprobanteIngresoRepository comprobanteIngresoService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await comprobanteIngresoService.GetAsync(parameters));
    }

    [HttpPost("Insert")]
    public async Task<IActionResult> Insert([FromBody] CreateComprobanteIngresoDto request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CreateComprobanteIngresoDto>(request)) }
        };
        return Ok(await comprobanteIngresoService.AddAsync(parameters));
    }

    [HttpPut("Cancel")]
    public async Task<IActionResult> Cancel([FromBody] UpdateComprobanteIngresoDto parameter)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", DataConverters.SerializeObjectCustom<UpdateComprobanteIngresoDto>(parameter) }
        };
        return Ok(await comprobanteIngresoService.CancelAsync(parameters));
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] UpdateComprobanteIngresoDto request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", DataConverters.SerializeObjectCustom<UpdateComprobanteIngresoDto>(request) }
        };
        return Ok(await comprobanteIngresoService.UpdateAsync(parameters));
    }
}
