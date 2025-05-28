using Common.Infrastructure.Data.Repository.Interfaces;
using Restaurant.Api.Entities;
using Restaurant.Api.Interfaces;

namespace Restaurant.Api.Services;

public class RecipeServiceService(IAdoRepository adoRepository, RestaurantContext context) : IRecipeService
{
    public async Task<ApiResponse> GetAsync()
    {
        var recipes = await context.Recipes.ToListAsync();
        return recipes.Count > 0
            ? new ApiResponse { Code = "1", Payload = recipes }
            : new ApiResponse { Code = "1", Message = "Recipes not found!" };
    }

    public async Task<ApiResponse> GetByIdAsync(int id)
    {
        var recipe = await context.Recipes.SingleOrDefaultAsync(x => x.Id == id);
        return recipe != null
            ? new ApiResponse { Code = "1", Payload = recipe }
            : new ApiResponse { Code = "1", Message = "Recipe not found!" };
    }

    public async Task<ApiResponse> CreateAsync(Recipe recipe)
    {
        await context.Recipes.AddAsync(recipe);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Registrada exitosamente", Payload = recipe };
    }

    public async Task<ApiResponse> UpdateAsync(int id, Recipe recipe)
    {
        var recipeFound = await context.Recipes.FindAsync(id);
        if (recipeFound == null) return new ApiResponse { Code = "1", Message = "Recipe not found!" };

        recipeFound.ItemId = recipe.ItemId;
        recipeFound.IngredientId = recipe.IngredientId;
        recipeFound.Instructions = recipe.Instructions;
        recipeFound.Quantity = recipe.Quantity;
        recipeFound.Unit = recipe.Unit;
        recipeFound.Weight = recipe.Weight;
        recipeFound.NetWeight = recipe.NetWeight;
        recipeFound.ExtentId = recipe.ExtentId;
        recipeFound.CostPrice = recipe.CostPrice;
        recipeFound.IsActive = recipe.IsActive;
        recipeFound.UpdatedByUserId = recipe.UpdatedByUserId;
        context.Update(recipeFound);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Actualizado exitosamente" };
    }

    public async Task<ApiResponse> RemoveAsync(int userId, int id)
    {
        var recipe = await context.Recipes.FindAsync(id);
        if (recipe == null) return new ApiResponse { Code = "1", Message = "Recipe not found!" };
         
        context.Remove(recipe);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Eliminada exitosamente" };
    }

    public async Task<ApiResponse> GetByItem(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync("Restaurant.Recipe_Get_By_Item", parameters);

        return DataValidation.DataSetIsNull(ds, true)
            ? new ApiResponse { Code = "0", Message = "Can't get data" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }
}
