namespace Restaurant.Infrastructure.Persistence.Repositories;

public class IngredientRepository(IAdoRepository adoRepository, RestaurantContext context) : IIngredientRepository
{
    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync("Restaurant.Ingredient_Get", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "Data not found" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<SpResponse> GetByIdAsync(int id)
    {
        var parameters = new Dictionary<string, object> { { "id", id } };
        var ds = await adoRepository.GetDataSetAsync("Restaurant.Ingredient_GetById", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "Data not found" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<SpResponse> AddAsync(Dictionary<string, object> parameters) =>
        await adoRepository.QuerySingleOrDefaultAsync<SpResponse>("Restaurant.Ingredient_Insert", parameters);

    public async Task<SpResponse> UpdateAsync(int id, Ingredient ingredient)
    {
        var ingredientFound = await context.Ingredients.FindAsync(id);
        if (ingredientFound == null) return new SpResponse { Code = "0", Message = "Ingredient not found" };
        ingredientFound.IngredientTypeId = ingredient.IngredientTypeId;
        ingredientFound.Quantity = ingredient.Quantity;
        ingredientFound.Summary = ingredient.Summary;
        ingredientFound.Unit = ingredient.Unit;
        ingredientFound.Content = ingredient.Content;
        ingredientFound.IsActive = ingredient.IsActive;
        ingredientFound.UpdatedByUserId = ingredient.UpdatedByUserId;
        context.Update(ingredientFound);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Actualizado exitosamente" };
    }

    public async Task<SpResponse> DeleteAsync(int userId, int id)
    {
        var ingredient = await context.Ingredients.FindAsync(id);
        if (ingredient == null) return new SpResponse { Code = "0", Message = "Ingredient not found" };

        context.Remove(ingredient);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Eliminado existosamente" };
    }
}
