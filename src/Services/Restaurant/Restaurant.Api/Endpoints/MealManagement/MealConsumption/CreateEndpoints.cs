namespace Restaurant.Api.Endpoints.MealManagement.MealConsumption;

public static class CreateEndpoints
{
    public static void MapCreateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/meal-consumptions")
            .RequireAuthorization()
            
            .WithDescription("Endpoints for managing meal consumption records.")
            .WithTags("Meal Consumptions");

        group.MapPost("/",
                async (MealConsumptionCreate request, IMealConsumptionService mealConsumptionService,
                    IUserContext userContext, CancellationToken cancellationToken) =>
                {
                    request = request with
                    {
                        CreatedByUserId = userContext.GetUserId()
                    };
                    return await mealConsumptionService.AddAsync(request).ToMinimalApiResultAsync();
                })
            .WithName("CreateMealConsumption")
            .WithSummary("Create a new meal consumption")
            .WithDescription("Create a new meal consumption record.")
            .Produces<MealConsumptionItem>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
