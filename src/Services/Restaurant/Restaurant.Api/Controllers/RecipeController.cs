using Microsoft.AspNetCore.Mvc;
using Restaurant.Api.Entities;
using Restaurant.Api.Interfaces;

namespace Restaurant.Api.Controllers;

public class RecipeController(IRecipeService recipeService) : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        return Ok(await recipeService.GetAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        return Ok(await recipeService.GetByIdAsync(id));
    }

    [HttpGet("GetByItem/{id}")]
    public async Task<IActionResult> GetByItem(int id)
    {
        var parameters =
            new Dictionary<string, object> { { "userRoleId", User.GetClaimValue<int>("userRoleId") }, { "id", id } };

        return Ok(await recipeService.GetByItem(parameters));
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Recipe recipe)
    {
        recipe.CreatedByUserId = User.GetUserId();
        return Ok(await recipeService.CreateAsync(recipe));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Recipe recipe)
    {
        recipe.UpdatedByUserId = User.GetUserId();
        return Ok(await recipeService.UpdateAsync(id, recipe));
    }

    [HttpDelete]
    public async Task<IActionResult> Delete(int id)
    {
        return Ok(await recipeService.RemoveAsync(User.GetUserId(), id));
    }
}
