namespace Configuration.Api.Controllers;

public class SolicitudAutorizacionController(ISolicitudAutorizacionService _svc) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await _svc.GetAsync(parameters));
    }


    [HttpPost]
    public async Task<IActionResult> Post(CreateSolicitudAutorizacionDto dto)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CreateSolicitudAutorizacionDto>(dto)) }
        };
        var response = await _svc.AddAsync(parameters);
        return Ok(response);
    }

    [HttpPut]
    public async Task<IActionResult> Put(UpdateSolicitudAutorizacionDto dto)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateSolicitudAutorizacionDto>(dto)) }
        };
        var response = await _svc.UpdateAsync(parameters);
        return Ok(response);
    }


    [HttpGet("VerifyUserPermission/{json}")]
    public async Task<IActionResult> VerifyUserPermission(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await _svc.GetAsync(parameters));
    }
}
