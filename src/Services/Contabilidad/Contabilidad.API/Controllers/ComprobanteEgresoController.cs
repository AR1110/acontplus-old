namespace Contabilidad.API.Controllers;

public class ComprobanteEgresoController : BaseApiController
{
    private readonly IComprobanteEgresoService _svc;

    public ComprobanteEgresoController(IComprobanteEgresoService service)
    {
        _svc = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await _svc.GetAsync(parameters);
        if (response == null) { return NoContent(); }

        ;
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
        };
        var response = await _svc.AddAsync(parameters);
        if (response == null) { return NoContent(); }

        ;
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Cancel(int id, string observacion)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "id", id }, { "observacion", observacion }
        };
        var response = await _svc.DeleteAsync(parameters);
        return Ok(response);
    }

    [HttpPut]
    public async Task<IActionResult> Put(ApiRequest request)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", DataConverters.SerializeDictionary(request.Data) }
        };

        var response = await _svc.UpdateAsync(parameters);
        return Ok(response);
    }
}
