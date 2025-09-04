using Microsoft.AspNetCore.Mvc;

namespace Restaurant.Api.Controllers;

public class ItemController(IItemService itemService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
            { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) } };

        return Ok(await itemService.GetAsync(parameters));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id) => Ok(await itemService.GetByIdAsync(id));

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] UpdateItemDto data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateItemDto>(data)) }
        };
        return Ok(await itemService.UpdateAsync(parameters));
    }
}
