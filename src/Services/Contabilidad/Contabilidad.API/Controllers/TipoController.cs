namespace Contabilidad.API.Controllers;

public class TipoController : BaseApiController
{
    private readonly ITipoService _tipoService;

    public TipoController(ITipoService tipoService)
    {
        _tipoService = tipoService;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await _tipoService.GetAsync(parameters));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Tipo tipo)
    {
        tipo.UserId = User.GetUserId();
        return Ok(await _tipoService.AddAsync(tipo));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Tipo tipo)
    {
        tipo.UserId = User.GetUserId();
        return Ok(await _tipoService.UpdateAsync(id, tipo));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        return Ok(await _tipoService.DeleteAsync(User.GetUserId(), id));
    }
}
