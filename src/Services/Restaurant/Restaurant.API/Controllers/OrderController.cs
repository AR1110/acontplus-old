using Common.AppSettings.Extensions;
using Common.Core.Models;
using Microsoft.AspNetCore.Mvc;
using Restaurant.API.Interfaces;
using Services.Common.Extensions;

namespace Restaurant.API.Controllers;

public class OrderController(IOrderService orderService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters =
            new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "json", json } };

        return Ok(await orderService.GetAsync(parameters));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ApiRequest data)
    {
        data.UserRoleId = User.GetUserRoleId();
        return Ok(await orderService.AddAsync(data));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] ApiRequest data)
    {
        data.UserRoleId = User.GetUserRoleId();

        return Ok(await orderService.PutAsync(id, data));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (id == 0) { return BadRequest("Id Incorrecto"); }

        return Ok(await orderService.DeleteAsync(User.GetUserId(), id));
    }

    [HttpGet("Print/{json}")]
    public async Task<IActionResult> Print(string json)
    {
        var parameters =
            new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "json", json } };
        return Ok(await orderService.PrintAsync(parameters));
    }
}
