using Common.AppSettings.Extensions;

namespace Contabilidad.API.Controllers;

public class AccountingMovementController(IAccountingMovementService accountingMovementService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await accountingMovementService.GetAsync(parameters));
    }
}
