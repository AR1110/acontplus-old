using Microsoft.AspNetCore.Mvc;

namespace Restaurant.Api.Controllers;

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
    public async Task<IActionResult> Put(int id, [FromBody] ApiRequest data)
    {
        data.UserRoleId = User.GetClaimValue<int>("userRoleId");
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", data.UserRoleId },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
        };
        return Ok(await menuService.PutAsync(parameters));
    }
}
