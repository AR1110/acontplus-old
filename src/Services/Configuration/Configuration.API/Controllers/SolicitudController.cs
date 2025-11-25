namespace Configuration.Api.Controllers;

public class SolicitudController(ISolicitudService solicitudService) : BaseApiController
{
    [HttpGet("Get/{json}")]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await solicitudService.GetAsync(parameters));
    }

    [HttpPost("Post/{json}")]
    public async Task<IActionResult> Post(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await solicitudService.AddAsync(parameters));
    }

    [HttpPut("Put/{json}")]
    public async Task<IActionResult> Put(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await solicitudService.UpdateAsync(parameters));
    }

    [HttpDelete("Delete/{json}")]
    public async Task<IActionResult> Delete(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await solicitudService.UpdateAsync(parameters));
    }

    [HttpGet("Check/{json}")]
    public async Task<IActionResult> Check(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await solicitudService.GetAsync(parameters));
    }
}
