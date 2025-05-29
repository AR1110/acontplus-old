using Microsoft.AspNetCore.Mvc;
using Restaurant.Application.Interfaces;

namespace Restaurant.Api.Controllers;

public class MenuItemController(IMenuItemService menuItemService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        };

        return Ok(await menuItemService.GetAsync(parameters));
    }

    [HttpGet("GetById/{id}")]
    public async Task<IActionResult> GetById(int id, string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id }, { "json", json }
        };

        return Ok(await menuItemService.GetIdAsync(parameters));
    }
}