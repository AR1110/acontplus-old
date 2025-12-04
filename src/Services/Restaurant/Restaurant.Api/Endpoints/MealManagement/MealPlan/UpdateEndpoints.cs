namespace Restaurant.Api.Endpoints.MealManagement.MealPlan;

public static class UpdateEndpoints
{
    public static void MapUpdateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/meal-plans")
            .RequireAuthorization()

            .WithDescription("Endpoints for managing meal plan records.")
            .WithTags("Meal Plans");
        group.MapPut("/{id:int}",
                async (int id, MealPlanUpdate request, IMealPlanService mealPlanService,
                    CancellationToken cancellationToken) =>
                {
                    return await mealPlanService.UpdateAsync(id, request, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("UpdateMealPlan")
            .WithSummary("Update a meal plan")
            .WithDescription("Update an existing meal plan by its ID.")
            .Produces<MealPlanItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
