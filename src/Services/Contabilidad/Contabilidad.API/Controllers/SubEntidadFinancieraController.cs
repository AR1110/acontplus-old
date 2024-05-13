namespace Contabilidad.API.Controllers;

public class SubEntidadFinancieraController : BaseApiController
{
    private readonly ISubEntidadFinancieraService _service;

    public SubEntidadFinancieraController(ISubEntidadFinancieraService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await _service.GetAsync(parameters);
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
        var response = await _service.AddAsync(parameters);
        if (response == null) { return NoContent(); }

        ;
        return Ok(response);
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
        };
        var response = await _service.UpdateAsync(parameters);
        if (response == null) { return NoContent(); }

        ;
        return Ok(response);
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "id", id } };
        var response = await _service.DeleteAsync(parameters);
        return Ok(response);
    }
}
