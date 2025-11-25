using Microsoft.AspNetCore.Mvc;

namespace Restaurant.Api.Controllers;

public class StatsController(IStatsService statsService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(json) }
        };
        return Ok(await statsService.GetAsync(parameters));
    }
}
