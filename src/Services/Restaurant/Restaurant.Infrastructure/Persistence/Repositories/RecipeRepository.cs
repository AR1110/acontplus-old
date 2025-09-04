namespace Restaurant.Infrastructure.Persistence.Repositories;

public class RecipeRepository(IAdoRepository adoRepository, RestaurantContext context) : IRecipeRepository
{
    public async Task<SpResponse> GetAsync()
    {
        var recipes = await context.Recipes.ToListAsync();
        return recipes.Count > 0
            ? new SpResponse { Code = "1", Payload = recipes }
            : new SpResponse { Code = "1", Message = "Recipes not found!" };
    }

    public async Task<SpResponse> GetByIdAsync(int id)
    {
        var recipe = await context.Recipes.SingleOrDefaultAsync(x => x.Id == id);
        return recipe != null
            ? new SpResponse { Code = "1", Payload = recipe }
            : new SpResponse { Code = "1", Message = "Recipe not found!" };
    }

    public async Task<SpResponse> CreateAsync(Recipe recipe)
    {
        await context.Recipes.AddAsync(recipe);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Registrada exitosamente", Payload = recipe };
    }

    public async Task<SpResponse> UpdateAsync(int id, Recipe recipe)
    {
        var recipeFound = await context.Recipes.FindAsync(id);
        if (recipeFound == null) return new SpResponse { Code = "1", Message = "Recipe not found!" };

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
        return new SpResponse { Code = "1", Message = "Actualizado exitosamente" };
    }

    public async Task<SpResponse> RemoveAsync(int userId, int id)
    {
        var recipe = await context.Recipes.FindAsync(id);
        if (recipe == null) return new SpResponse { Code = "1", Message = "Recipe not found!" };

        context.Remove(recipe);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Eliminada exitosamente" };
    }

    public async Task<SpResponse> GetByItem(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync("Restaurant.Recipe_Get_By_Item", parameters);

        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "Can't get data" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }
}
