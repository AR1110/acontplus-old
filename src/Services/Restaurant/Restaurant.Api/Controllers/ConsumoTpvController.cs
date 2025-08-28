using Microsoft.AspNetCore.Mvc;

namespace Restaurant.Api.Controllers;

public class ConsumoTpvController(IConsumptionService consumption) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var response = await consumption.GetAsync(new Dictionary<string, object>
        {
            { "idRol", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        });
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Post(string json)
    {
        var response = await consumption.AddAsync(new Dictionary<string, object>
        {
            { "idRol", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        });
        return Ok(response);
    }

    [HttpPut]
    public async Task<IActionResult> Put(string json)
    {
        var response = await consumption.UpdateAsync(new Dictionary<string, object>
        {
            { "idRol", User.GetClaimValue<int>("userRoleId") }, { "json", SqlStringParam.Sanitize(json) }
        });
        return Ok(response);
    }

    [HttpDelete]
    public async Task<IActionResult> Delete(int id)
    {
        var response =
            await consumption.DeleteAsync(new Dictionary<string, object>
            {
                { "idRol", User.GetClaimValue<int>("userRoleId") }, { "id", id }
            });
        return Ok(response);
    }

    [HttpPost("Print")]
    public async Task<IActionResult> Print(int id)
    {
        var response =
            await consumption.PrintAsync(new Dictionary<string, object>
            {
                { "idRol", User.GetClaimValue<int>("userRoleId") }, { "id", id }
            });
        return Ok(response);
    }
}