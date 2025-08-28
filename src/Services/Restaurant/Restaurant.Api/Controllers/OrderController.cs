using Microsoft.AspNetCore.Mvc;
using Restaurant.Domain.Repositories;

namespace Restaurant.Api.Controllers;

public class OrderController(IOrderRepository orderService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters =
            new Dictionary<string, object>
                { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", json } };

        return Ok(await orderService.GetAsync(parameters));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ApiRequest data)
    {
        data.UserRoleId = User.GetClaimValue<int>("userRoleId");
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", data.UserRoleId },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
        };
        return Ok(await orderService.AddAsync(parameters));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Put(int id, [FromBody] ApiRequest data)
    {
        data.UserRoleId = User.GetClaimValue<int>("userRoleId");
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", data.UserRoleId },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeDictionary(data.Data)) }
        };
        return Ok(await orderService.PutAsync(parameters));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (id == 0) return BadRequest("Id Incorrecto");

        return Ok(await orderService.DeleteAsync(User.GetUserId(), id));
    }

    [HttpGet("Print")]
    public async Task<IActionResult> Print(string json)
    {
        var parameters =
            new Dictionary<string, object>
                { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", json } };
        return Ok(await orderService.PrintAsync(parameters));
    }
}
