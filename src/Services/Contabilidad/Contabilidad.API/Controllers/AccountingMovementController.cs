namespace Contabilidad.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountingMovementController(IAccountingMovementService _isvc) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await _isvc.GetAsync(parameters));
    }
}
