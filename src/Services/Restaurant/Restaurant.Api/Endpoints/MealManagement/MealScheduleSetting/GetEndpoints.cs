namespace Restaurant.Api.Endpoints.MealManagement.MealScheduleSetting;

public static class GetEndpoints
{
    public static void MapGetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/meal-schedule-settings")
            .RequireAuthorization()

            .WithDescription("Endpoints for managing meal schedule setting records.")
            .WithTags("Meal Schedule Settings");
        group.MapGet("/{establishmentId:int}",
                async (int establishmentId, IMealScheduleSettingService mealScheduleSettingService,
                    CancellationToken cancellationToken) =>
                {
                    return await mealScheduleSettingService.GetAsync(establishmentId, cancellationToken)
                        .ToGetMinimalApiResultAsync();
                })
            .WithName("GetAllMealScheduleSettings")
            .WithSummary("Get all meal schedule settings")
            .WithDescription("Retrieve a list of all meal schedule settings.")
            .Produces<IReadOnlyList<MealScheduleSettingItem>>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
