namespace Inventario.API.Controllers;

public class TarifaController : BaseApiController
{
    private readonly ITarifaService _service;

    public TarifaController(ITarifaService service)
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

    
}
