namespace Purchases.Api.Controllers;

public class ArticuloController(IArticuloRepository articuloService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "jsonData", SqlStringParam.Sanitize(json) }
        };
        return Ok(await articuloService.GetAsync(parameters));
    }
}
