using Microsoft.AspNetCore.Mvc;
using Restaurant.Domain.Entities;
using Restaurant.Domain.Repositories;

namespace Restaurant.Api.Controllers;

public class IngredientController(IIngredientRepository ingredientService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get(string json)
    {
        var parameters = new Dictionary<string, object>
            { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "json", json } };
        return Ok(await ingredientService.GetAsync(parameters));
    }

    [HttpGet("GetById/{id:int}")]
    public async Task<IActionResult> GetById(int id) => Ok(await ingredientService.GetByIdAsync(id));

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] ApiRequest data)
    {
        data.UserRoleId = User.GetClaimValue<int>("userRoleId");
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", data.UserRoleId }, { "json", DataConverters.SerializeDictionary(data.Data) }
        };
        return Ok(await ingredientService.AddAsync(parameters));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Put(int id, [FromBody] Ingredient ingredient)
    {
        ingredient.UpdatedByUserId = User.GetUserId();
        return Ok(await ingredientService.UpdateAsync(id, ingredient));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id) => Ok(await ingredientService.DeleteAsync(User.GetUserId(), id));
}
