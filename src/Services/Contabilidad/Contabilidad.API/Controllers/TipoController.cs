namespace Contabilidad.API.Controllers;

public class TipoController(ITipoService tipoService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await tipoService.GetAsync(parameters));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Tipo tipo)
    {
        tipo.UserId = User.GetUserId();
        return Ok(await tipoService.AddAsync(tipo));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Tipo tipo)
    {
        tipo.UserId = User.GetUserId();
        return Ok(await tipoService.UpdateAsync(id, tipo));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        return Ok(await tipoService.DeleteAsync(User.GetUserId(), id));
    }
}