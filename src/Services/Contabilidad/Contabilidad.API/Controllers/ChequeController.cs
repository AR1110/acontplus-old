namespace Contabilidad.API.Controllers;

public class ChequeController(IChequeService chequeService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await chequeService.GetAsync(parameters);
        return Ok(response);
    }
}