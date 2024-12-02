using Common.AppSettings.Extensions;
using Common.Core.Models;
using Common.Core.Utils;
using Microsoft.AspNetCore.Mvc;
using Restaurant.API.Interfaces;
using Services.Common.Extensions;

namespace Restaurant.API.Controllers;

public class ItemController(IItemService itemService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "json", SqlStringParam.Sanitize(json) } };

        return Ok(await itemService.GetAsync(parameters));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        return Ok(await itemService.GetByIdAsync(id));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] ApiRequest data)
    {
        data.UserRoleId = User.GetUserRoleId();
        return Ok(await itemService.UpdateAsync(id, data));
    }
}
