namespace Restaurant.Api.Endpoints.MealManagement.MealScheduleSetting;

public static class UpdateEndpoints
{
    public static void MapUpdateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/meal-schedule-settings")
            .RequireAuthorization()
            .WithOpenApi()
            .WithDescription("Endpoints for managing meal schedule setting records.")
            .WithTags("Meal Schedule Settings");
        group.MapPut("/{id:int}",
                async (int id, MealScheduleSettingUpdate request,
                    IMealScheduleSettingService mealScheduleSettingService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    request = request with
                    {
                        UpdatedByUserId = userContext.GetUserId()
                    };
                    return await mealScheduleSettingService.UpdateAsync(id, request, cancellationToken)
                        .ToMinimalApiResultAsync();
                })
            .WithName("UpdateMealScheduleSetting")
            .WithSummary("Update an existing meal schedule setting")
            .WithDescription("Update an existing meal schedule setting record.")
            .Produces<MealScheduleSettingItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
