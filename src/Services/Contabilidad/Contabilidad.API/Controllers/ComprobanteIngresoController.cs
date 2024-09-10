namespace Contabilidad.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ComprobanteIngresoController(IComprobanteIngresoService _svc) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await _svc.GetAsync(parameters));
    }

    [HttpPost("Insert")]
    public async Task<IActionResult> Insert([FromBody] ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(request.Data)) }
        };
        return Ok(await _svc.AddAsync(parameters));
    }

    [HttpPut("Cancel")]
    public async Task<IActionResult> Cancel(ApiRequest paremeter)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", DataConverters.SerializeDictionary(paremeter.Data) }
        };
        return Ok(await _svc.CancelAsync(parameters));
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "id", id },
            { "json", DataConverters.SerializeDictionary(request.Data) }
        };
        return Ok(await _svc.UpdateAsync(parameters));
    }
}
