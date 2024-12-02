using Common.AppSettings.Extensions;
using Microsoft.AspNetCore.Mvc;
using Restaurant.API.Services;
using Services.Common.Extensions;

namespace Restaurant.API.Controllers;

public class ConfigurationController(IConfigurationService configurationService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "json", json } };
        return Ok(await configurationService.GetAsync(parameters));
    }
}
