namespace Configuration.Api.Controllers;

public class BodegaAsignacionController(IBodegaAsignacionService bodegaAsignacionService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        var response = await bodegaAsignacionService.GetAsync(parameters);
        return response == null ? NoContent() : Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] CreateBodegaAsignacionDto data)
    {
        var parameters = new Dictionary<string, object>
    {
        { "userRoleId", User.GetClaimValue<int>("userRoleId") },
        { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CreateBodegaAsignacionDto>(data)) },
        { "fromMobile", HttpContext.Items["FromMobile"] as bool? ?? false }
    };
        var response = await bodegaAsignacionService.AddAsync(parameters);
        return response == null ? NoContent() : Ok(response);
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id)
    {
        var parameters = new Dictionary<string, object>
        { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };
        var response = await bodegaAsignacionService.UpdateAsync(parameters);
        return response == null ? NoContent() : Ok(response);
    }
}