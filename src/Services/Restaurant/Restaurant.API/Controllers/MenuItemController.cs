using Common.Core.Utils;
using Microsoft.AspNetCore.Mvc;
using Restaurant.API.Interfaces;
using Services.Common.Extensions;

namespace Restaurant.API.Controllers;

public class MenuItemController(IMenuItemService menuItemService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) }
        };
        
        return Ok(await menuItemService.GetAsync(parameters));
    }

    [HttpGet("GetById/{id}")]
    public async Task<IActionResult> GetById(int id, string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetUserRoleId() }, { "id", id }, { "json", json }
        };

        return Ok(await menuItemService.GetIdAsync(parameters));
    }
}
