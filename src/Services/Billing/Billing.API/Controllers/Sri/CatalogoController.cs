namespace Billing.Api.Controllers.Sri;

public class CatalogoController(ICatalogoService catalogoService) : BaseApiController
{
    [HttpGet("Get")]
    public async Task<IActionResult> Get()
    {
        var parameters = new Dictionary<string, object>();
        return Ok(await catalogoService.GetAsync(parameters));
    }
}