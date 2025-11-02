namespace Restaurant.API.Endpoints.MealManagement.MealPlan;

public static class UpdateEndpoints
{
    public static void MapUpdateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/meal-plans")
            .RequireAuthorization()
            .WithOpenApi()
            .WithDescription("Endpoints for managing meal plan records.")
            .WithTags("Meal Plans");
        group.MapPut("/{id:int}", async (int id, UpdateMealPlanRequest request, IMealPlanService mealPlanService, CancellationToken cancellationToken) =>
        {
            return await mealPlanService.UpdateAsync(id, request, cancellationToken).ToMinimalApiResultAsync();
        })
            .WithName("UpdateMealPlan")
            .WithSummary("Update a meal plan")
            .WithDescription("Update an existing meal plan by its ID.")
            .Produces<MealPlanResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
