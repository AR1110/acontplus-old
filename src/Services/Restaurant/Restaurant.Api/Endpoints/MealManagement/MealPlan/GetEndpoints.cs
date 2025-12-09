namespace Restaurant.Api.Endpoints.MealManagement.MealPlan;

public static class GetEndpoints
{
    public static void MapGetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/meal-plans")
            .RequireAuthorization()

            .WithDescription("Endpoints for managing meal plan records.")
            .WithTags("Meal Plans");
        group.MapGet("/{establishmentId:int}",
                async (int establishmentId, IMealPlanService mealPlanService, CancellationToken cancellationToken) =>
                {
                    return await mealPlanService.GetAsync(establishmentId, cancellationToken)
                        .ToGetMinimalApiResultAsync();
                })
            .WithName("GetAllMealPlans")
            .WithSummary("Get all meal plans")
            .WithDescription("Retrieve a list of all meal plans.")
            .Produces<IReadOnlyList<MealPlanItem>>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
