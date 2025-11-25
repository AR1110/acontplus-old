namespace Configuration.Api.Controllers;

public class TipoEntidadController(ITipoEntidadService tipoEntidadService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await tipoEntidadService.GetAsync(parameters));
    }

    [HttpPost("Insert")]
    public async Task<IActionResult> Insert(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await tipoEntidadService.AddAsync(parameters));
    }

    [HttpPut("Update/{id}")]
    public async Task<IActionResult> Update(int id, string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id },
            { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await tipoEntidadService.UpdateAsync(parameters));
    }

    [HttpDelete("Delete/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var parameters = new Dictionary<string, object>
            { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };
        return Ok(await tipoEntidadService.DeleteAsync(parameters));
    }
}
