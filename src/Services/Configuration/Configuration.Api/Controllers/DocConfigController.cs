namespace Configuration.Api.Controllers;

public class DocConfigController(IDocConfigService docConfigService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await docConfigService.GetAsync(parameters);
        return response == null ? NoContent() : Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post(CreateDocConfigDto data)
    {
        var parameters = new Dictionary<string, object>
    {
        { "userRoleId", User.GetClaimValue<int>("userRoleId") },
        { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CreateDocConfigDto>(data)) },
        { "fromMobile", HttpContext.Items["FromMobile"] as bool? ?? false }
    };
        return Ok(await docConfigService.AddAsync(parameters));
    }
}