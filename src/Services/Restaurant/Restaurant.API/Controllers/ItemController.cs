using Microsoft.AspNetCore.Mvc;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Restaurant.API.Controllers;

public class ItemController(IItemService itemService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
        { 
            { "UserRoleId", User.GetClaimValue<int>("userRoleId") }, 
            { "Json", SqlStringParam.Sanitize(json) } 
        };
        return Ok(await itemService.GetAsync(parameters));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var parameters = new Dictionary<string, object>
        {
            { "Id", id }
        };
        return Ok(await itemService.GetByIdAsync(parameters));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] UpdateItemDto data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "UserRoleId", User.GetClaimValue<int>("userRoleId") },
            { "Id", id },
            { "Json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateItemDto>(data)) }
        };
        return Ok(await itemService.UpdateAsync(parameters));
    }
}
