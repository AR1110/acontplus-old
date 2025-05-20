namespace Contabilidad.API.Controllers;

public class ComprobanteIngresoController(IComprobanteIngresoService comprobanteIngresoService) : BaseApiController
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
    public async Task<IActionResult> Insert([FromBody] ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data)) }
        };
        return Ok(await comprobanteIngresoService.AddAsync(parameters));
    }

    [HttpPut("Cancel")]
    public async Task<IActionResult> Cancel(ApiRequest paremeter)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", DataConverters.SerializeDictionary(paremeter.Data) }
        };
        return Ok(await comprobanteIngresoService.CancelAsync(parameters));
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", DataConverters.SerializeDictionary(request.Data) }
        };
        return Ok(await comprobanteIngresoService.UpdateAsync(parameters));
    }
}