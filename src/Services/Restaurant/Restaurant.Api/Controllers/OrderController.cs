using Microsoft.AspNetCore.Mvc;
using Restaurant.Application.DTOs;
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
    public async Task<IActionResult> Post([FromBody] CreateOrderDto data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CreateOrderDto>(data)) }
        };
        return Ok(await orderService.AddAsync(parameters));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Put(int id, [FromBody] UpdateOrderDto data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", User.GetClaimValue<int>("userRoleId") },
            { "id", id },
            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateOrderDto>(data)) }
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
