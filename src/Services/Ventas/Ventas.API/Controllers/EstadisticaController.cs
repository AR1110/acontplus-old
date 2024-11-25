namespace Ventas.API.Controllers;

public class EstadisticaController(IEstadisticaService estadisticaService) : BaseApiController
{
    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idRol", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await estadisticaService.GetAsync(parameters));
    }
}
