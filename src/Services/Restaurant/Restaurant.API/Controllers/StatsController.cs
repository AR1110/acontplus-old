using Common.Core.Utils;
using Microsoft.AspNetCore.Mvc;
using Restaurant.API.Services;
using Services.Common.Extensions;

namespace Restaurant.API.Controllers;
public class StatsController(IStatsService statsService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            {"userRoleId", User.GetUserRoleId() },
            {"json", SqlStringParam.Sanitize(json)}
        };
        return Ok(await statsService.GetAsync(parameters));
    }
}
