using Common.Infrastructure.Data.Repository.Interfaces;
using Restaurant.Api.Entities;
using Restaurant.Api.Interfaces;

namespace Restaurant.Api.Services;

public class IngredientService(IAdoRepository adoRepository, RestaurantContext context) : IIngredientService
{
    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoRepository.GetDataSetAsync("Restaurant.Ingredient_Get", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new ApiResponse { Code = "0", Message = "Data not found" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<ApiResponse> GetByIdAsync(int id)
    {
        var parameters = new Dictionary<string, object> { { "id", id } };
        var ds = await adoRepository.GetDataSetAsync("Restaurant.Ingredient_GetById", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new ApiResponse { Code = "0", Message = "Data not found" }
            : new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<ApiResponse> AddAsync(ApiRequest data)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", data.UserRoleId }, { "json", DataConverters.SerializeDictionary(data.Data) }
        };
        return await adoRepository.SpExecuteAsync<ApiResponse>("Restaurant.Ingredient_Insert", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(int id, Ingredient ingredient)
    {
        var ingredientFound = await context.Ingredients.FindAsync(id);
        if (ingredientFound == null) return new ApiResponse { Code = "0", Message = "Ingredient not found" };
        ingredientFound.IngredientTypeId = ingredient.IngredientTypeId;
        ingredientFound.Quantity = ingredient.Quantity;
        ingredientFound.Summary = ingredient.Summary;
        ingredientFound.Unit = ingredient.Unit;
        ingredientFound.Content = ingredient.Content;
        ingredientFound.Enabled = ingredient.Enabled;
        ingredientFound.UserId = ingredient.UserId;
        context.Update(ingredientFound);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Actualizado exitosamente" };
    }

    public async Task<ApiResponse> DeleteAsync(int userId, int id)
    {
        var ingredient = await context.Ingredients.FindAsync(id);
        if (ingredient == null) return new ApiResponse { Code = "0", Message = "Ingredient not found" };

        ingredient.Enabled = false;
        ingredient.Deleted = true;
        ingredient.UserId = userId;
        context.Update(ingredient);
        await context.SaveChangesAsync();
        return new ApiResponse { Code = "1", Message = "Eliminado existosamente" };
    }
}