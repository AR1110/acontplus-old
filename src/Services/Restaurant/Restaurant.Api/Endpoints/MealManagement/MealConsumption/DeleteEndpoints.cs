namespace Restaurant.Api.Endpoints.MealManagement.MealConsumption;

public static class DeleteEndpoints
{
    public static void MapDeleteEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/meal-consumptions")
            .RequireAuthorization()
            
            .WithDescription("Endpoints for managing meal consumption records.")
            .WithTags("Meal Consumptions");

        group.MapDelete("/{id:int}",
                async (int id, IMealConsumptionService mealConsumptionService, CancellationToken cancellationToken) =>
                {
                    return await mealConsumptionService.DeleteAsync(id, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("DeleteMealConsumption")
            .WithSummary("Delete a meal consumption")
            .WithDescription("Delete a meal consumption record by its ID.")
            .Produces(StatusCodes.Status204NoContent)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
