using Microsoft.AspNetCore.Mvc;
using Restaurant.API.Services;

namespace Restaurant.API.Controllers;

public class ConfigurationController(IConfigurationService configurationService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object> { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", json } };
        return Ok(await configurationService.GetAsync(parameters));
    }
}
