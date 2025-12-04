namespace Restaurant.Api.Endpoints.MealManagement.MealPlan;

public static class CreateEndpoints
{
    public static void MapCreateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/meal-plans")
            .RequireAuthorization()

            .WithDescription("Endpoints for managing meal plan records.")
            .WithTags("Meal Plans");
        group.MapPost("/",
                async (MealPlanCreate request, IMealPlanService mealPlanService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    request = request with
                    {
                        CreatedByUserId = userContext.GetUserId()
                    };
                    return await mealPlanService.AddAsync(request).ToMinimalApiResultAsync();
                })
            .WithName("CreateMealPlan")
            .WithSummary("Create a new meal plan")
            .WithDescription("Create a new meal plan record.")
            .Produces<MealPlanItem>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
