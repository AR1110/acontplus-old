namespace Configuration.Api.Controllers;

public class EmailConfigController(IEmailConfigService emailConfigService) : BaseApiController
{
    [HttpGet("Get")]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await emailConfigService.GetAsync(parameters));
    }

    [HttpPut]
    public async Task<IActionResult> Put(int id, [FromBody] UpdateEmailConfigDto dto)
    {
        var parameters = new Dictionary<string, object>
      {
          { "userRoleId", User.GetClaimValue<int>("userRoleId") },
          { "idEmailConfig", id },
          { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateEmailConfigDto>(dto)) }
      };
        return Ok(await emailConfigService.UpdateAsync(parameters));
    }
}
