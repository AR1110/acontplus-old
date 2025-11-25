namespace Restaurant.Api.Endpoints.MealManagement.MealConsumption;

public static class UpdateEndpoints
{
    public static void MapUpdateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/meal-consumptions")
            .RequireAuthorization()
            .WithOpenApi()
            .WithDescription("Endpoints for managing meal consumption records.")
            .WithTags("Meal Consumptions");
        group.MapPut("/{id:int}",
                async (int id, MealConsumptionUpdate request, IMealConsumptionService mealConsumptionService,
                    IUserContext userContext, CancellationToken cancellationToken) =>
                {
                    request = request with
                    {
                        Id = id,
                        CancelledByUserId = userContext.GetUserId()
                    };
                    return await mealConsumptionService.UpdateAsync(id, request).ToMinimalApiResultAsync();
                })
            .WithName("UpdateMealConsumption")
            .WithSummary("Update an existing meal consumption")
            .WithDescription("Update an existing meal consumption record.")
            .Produces<MealConsumptionItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
