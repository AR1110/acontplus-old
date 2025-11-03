namespace Restaurant.API.Endpoints.MealManagement.MealPlan;

public static class GetEndpoints
{
    public static void MapGetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/meal-plans")
            .RequireAuthorization()
            .WithOpenApi()
            .WithDescription("Endpoints for managing meal plan records.")
            .WithTags("Meal Plans");
        group.MapGet("/{establishmentId:int}", async (int establishmentId, IMealPlanService mealPlanService, CancellationToken cancellationToken) =>
        {
            return await mealPlanService.GetAsync(establishmentId, cancellationToken).ToMinimalApiResultAsync();
        })
            .WithName("GetAllMealPlans")
            .WithSummary("Get all meal plans")
            .WithDescription("Retrieve a list of all meal plans.")
            .Produces<IReadOnlyList<MealPlanResponse>>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}

