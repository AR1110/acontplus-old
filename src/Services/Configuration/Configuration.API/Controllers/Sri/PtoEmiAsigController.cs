namespace Configuration.Api.Controllers.Sri;

public class PtoEmiAsigController(IPuntoEmisionAsignacionService puntoEmisionAsignacionService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await puntoEmisionAsignacionService.GetAsync(parameters);
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] CreatePtoEmiAsigDto createPto)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CreatePtoEmiAsigDto>(createPto)) },
            { "fromMobile", HttpContext.Items["FromMobile"] as bool? ?? false }
        };
        var response = await puntoEmisionAsignacionService.AddAsync(parameters);
        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id)
    {
        var parameters = new Dictionary<string, object>
      {
        { "userRoleId", User.GetClaimValue<int>("userRoleId") },
        { "id", id },
    };
        var response = await puntoEmisionAsignacionService.UpdateAsync(parameters);
        return Ok(response);
    }
}