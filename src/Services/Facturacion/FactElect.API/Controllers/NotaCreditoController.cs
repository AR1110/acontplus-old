namespace FactElect.API.Controllers;

public class NotaCreditoController(INotaCreditoService notaCreditoService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idRol", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await notaCreditoService.GetAsync(parameters));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
        };
        return Ok(await notaCreditoService.AddAsync(parameters));
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
        return Ok(await notaCreditoService.UpdateAsync(parameters));
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object> { { "idUsuarioRol", User.GetClaimValue<int>("userRoleId") }, { "id", id }, };
        return Ok(await notaCreditoService.DeleteAsync(parameters));
    }
}
