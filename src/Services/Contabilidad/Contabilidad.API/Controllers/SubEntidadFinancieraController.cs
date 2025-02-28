namespace Contabilidad.API.Controllers;

public class SubEntidadFinancieraController(ISubEntidadFinancieraService subEntidadFinancieraService)
    : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await subEntidadFinancieraService.GetAsync(parameters);
        if (response == null) { return NoContent(); }

        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ApiRequest data)
    {
        var fromMobile = HttpContext.Items["FromMobile"] as bool? ?? false;

        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) },
            { "fromMobile", fromMobile }
        };
        var response = await subEntidadFinancieraService.AddAsync(parameters);
        if (response == null) { return NoContent(); }

        return Ok(response);
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
        };
        var response = await subEntidadFinancieraService.UpdateAsync(parameters);
        if (response == null) { return NoContent(); }

        return Ok(response);
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object> { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };
        var response = await subEntidadFinancieraService.DeleteAsync(parameters);
        return Ok(response);
    }
}
