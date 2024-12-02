using Common.AppSettings.Extensions;
using Common.Core.Models;
using Microsoft.AspNetCore.Mvc;
using Restaurant.API.Entities;
using Restaurant.API.Interfaces;
using Services.Common.Extensions;

namespace Restaurant.API.Controllers;

public class IngredientController(IIngredientService ingredientService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object> { { "userRoleId", User.GetUserRoleId() }, { "json", json } };
        return Ok(await ingredientService.GetAsync(parameters));
    }

    [HttpGet("GetById/{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        return Ok(await ingredientService.GetByIdAsync(id));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ApiRequest data)
    {
        data.UserRoleId = User.GetUserRoleId();
        return Ok(await ingredientService.AddAsync(data));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Ingredient ingredient)
    {
        ingredient.UserId = User.GetUserId();
        return Ok(await ingredientService.UpdateAsync(id, ingredient));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        return Ok(await ingredientService.DeleteAsync(User.GetUserId(), id));
    }
}
