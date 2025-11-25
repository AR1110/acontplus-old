namespace Sales.Api.Controllers;

public class EstadisticaController(IEstadisticaService estadisticaService) : BaseApiController
{
    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await estadisticaService.GetAsync(parameters));
    }
}
