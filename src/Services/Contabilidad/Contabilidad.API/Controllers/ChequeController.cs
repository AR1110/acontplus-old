namespace Contabilidad.API.Controllers;

public class ChequeController : BaseApiController
{
    private readonly IChequeService _service;

    public ChequeController(IChequeService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await _service.GetAsync(parameters);
        if (response == null) { return NoContent(); }

        ;
        return Ok(response);
    }
}
