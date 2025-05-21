using Microsoft.AspNetCore.Mvc;
using Restaurant.Api.Interfaces;

namespace Restaurant.Api.Controllers;

public class ConfigTpvController(IConsumptionConfigService configService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var response =
            await configService.GetAsync(new Dictionary<string, object>
                { { "idRol", User.GetClaimValue<int>("userRoleId") } });

        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post(string json)
    {
        var response = await configService.AddAsync(new Dictionary<string, object>
        {
            { "idRol", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        });
        return Ok(response);
    }

    [HttpPut]
    public async Task<IActionResult> Put(string json)
    {
        var response = await configService.UpdateAsync(new Dictionary<string, object>
        {
            { "idRol", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        });
        return Ok(response);
    }

    [HttpDelete]
    public async Task<IActionResult> Delete(int id)
    {
        var response =
            await configService.DeleteAsync(new Dictionary<string, object>
            {
                { "idRol", User.GetClaimValue<int>("userRoleId") }, { "id", id }
            });
        return Ok(response);
    }
}