using Common.Core.Models;
using Common.Core.Utils;
using Microsoft.AspNetCore.Mvc;
using Restaurant.API.Interfaces;
using Services.Common.Extensions;

namespace Restaurant.API.Controllers;

public class IngredientController(IIngredientService ingredient, ICustomLogger log) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "json", json } };
        return Ok(await ingredient.GetAsync(parameters));
    }

    [HttpGet("GetById/{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        return Ok(await ingredient.GetByIdAsync(id));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ApiRequest data)
    {
        data.UserRoleId = User.GetUserRoleId();
        return Ok(await ingredient.AddAsync(data));
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] ApiRequest data)
    {
        data.UserRoleId = User.GetUserRoleId();
        return Ok(await ingredient.UpdateAsync(id, data));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        return Ok(await ingredient.DeleteAsync(User.GetUserId(), id));
    }
}
