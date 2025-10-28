using Microsoft.AspNetCore.Mvc;

namespace Restaurant.API.Controllers;

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
    public async Task<IActionResult> Post([FromBody] CreateIngredientRequestDto data)
    {
        var userRoleId = User.GetClaimValue<int>("userRoleId");
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userRoleId },
            { "json", DataConverters.SerializeObjectCustom<CreateIngredientRequestDto>(data) }
        };
        return Ok(await ingredientService.AddAsync(parameters));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Put(int id, [FromBody] UpdateIngredientDto data)
    {
        var ingredient = new Ingredient
        {
            Id = id,
            ProductId = data.ProductId,
            Summary = data.Summary,
            IngredientTypeId = data.IngredientTypeId,
            Quantity = data.Quantity,
            Unit = data.Unit,
            Content = data.Content,
            UpdatedByUserId = User.GetUserId(),
            IngredientType = null
        };
        return Ok(await ingredientService.UpdateAsync(id, ingredient));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id) => Ok(await ingredientService.DeleteAsync(User.GetUserId(), id));
}
