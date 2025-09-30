using Microsoft.AspNetCore.Mvc;

namespace Restaurant.API.Controllers;

public class MenuController(IMenuService menuService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters =
            new Dictionary<string, object>
                { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", json } };
        return Ok(await menuService.GetAsync(parameters));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] UpdateMenuDto data)
    {
        var userRoleId = User.GetClaimValue<int>("userRoleId");
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userRoleId },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateMenuDto>(data)) }
        };
        return Ok(await menuService.PutAsync(parameters));
    }
}
