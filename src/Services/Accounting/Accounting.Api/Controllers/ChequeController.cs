namespace Accounting.Api.Controllers;

public class ChequeController(IChequeRepository chequeRepository) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await chequeRepository.GetAsync(parameters);
        return Ok(response);
    }
}
