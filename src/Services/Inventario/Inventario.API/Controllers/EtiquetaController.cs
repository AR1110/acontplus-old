namespace Inventario.API.Controllers;

public class EtiquetaController : BaseApiController
{
    private readonly IEtiquetaService _service;

    public EtiquetaController(IEtiquetaService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "json", SqlStringParam.Sanitize(json) }
        };

        var response = await _service.GetAsync(parameters);
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) },
            { "fromMobile", HttpContext.Items["FromMobile"] as bool? ?? false }
        };

        var response = await _service.AddAsync(parameters);

        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "id", id },
             { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) },
              { "fromMobile", HttpContext.Items["FromMobile"] as bool? ?? false }
        };

        var response = await _service.UpdateAsync(parameters);
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "id", id },
        };

        var response = await _service.DeleteAsync(parameters);
        return Ok(response);
    }
}
