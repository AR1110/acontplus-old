namespace Compras.API.Controllers;

public class ArticuloController(IArticuloService articuloService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "idRol", User.GetUserRoleId() }, { "jsonData", SqlStringParam.Sanitize(json) }
        };
        return Ok(await articuloService.GetAsync(parameters));
    }
}
