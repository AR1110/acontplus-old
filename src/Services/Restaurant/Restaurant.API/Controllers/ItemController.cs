using Microsoft.AspNetCore.Mvc;
using Restaurant.API.Interfaces;

namespace Restaurant.API.Controllers;

public class ItemController(IItemService itemService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object> { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) } };

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
        data.UserRoleId = User.GetClaimValue<int>("userRoleId");
        return Ok(await itemService.UpdateAsync(id, data));
    }
}
