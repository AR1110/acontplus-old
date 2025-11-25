namespace Restaurant.Api.Endpoints.MealManagement.MealPlan;

public static class DeleteEndpoints
{
    public static void MapDeleteEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/meal-plans")
            .RequireAuthorization()
            .WithOpenApi()
            .WithDescription("Endpoints for managing meal plan records.")
            .WithTags("Meal Plans");
        group.MapDelete("/{id:int}",
                async (int id, IMealPlanService mealPlanService, CancellationToken cancellationToken) =>
                {
                    return await mealPlanService.DeleteAsync(id).ToMinimalApiResultAsync();
                })
            .WithName("DeleteMealPlan")
            .WithSummary("Delete a meal plan")
            .WithDescription("Delete a meal plan record by its ID.")
            .Produces(StatusCodes.Status204NoContent)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
