using Microsoft.AspNetCore.Mvc;
using Restaurant.API.Interfaces;

namespace Restaurant.API.Controllers;

public class MenuController(IMenuService menuService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters =
            new Dictionary<string, object> { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", json } };
        return Ok(await menuService.GetAsync(parameters));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] ApiRequest data)
    {
        data.UserRoleId = User.GetClaimValue<int>("userRoleId");
        return Ok(await menuService.PutAsync(id, data));
    }
}
