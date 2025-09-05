using Microsoft.AspNetCore.Mvc;

namespace Restaurant.Api.Controllers;

public class ConfigPrinterController(IConsumptionConfigService configService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var response =
            await configService.GetPrinterAsync(
                new Dictionary<string, object> { { "userRoleId", User.GetClaimValue<int>("userRoleId") } });
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post(bool estado)
    {
        var response = await configService.AddPrinterAsync(
            new Dictionary<string, object>
                { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "estado", estado } });
        return Ok(response);
    }
}
