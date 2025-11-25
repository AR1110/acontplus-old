namespace Accounting.Api.Controllers;

public class AccountingMovementController(IAccountingMovementRepository accountingMovementService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await accountingMovementService.GetAsync(parameters));
    }
}
