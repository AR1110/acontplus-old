namespace Restaurant.Api.Endpoints.MealManagement.MealScheduleSetting;

public static class CreateEndpoints
{
    public static void MapCreateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/meal-schedule-settings")
            .RequireAuthorization()

            .WithDescription("Endpoints for managing meal schedule setting records.")
            .WithTags("Meal Schedule Settings");

        group.MapPost("/",
                async (MealScheduleSettingCreate request, IMealScheduleSettingService mealScheduleSettingService,
                    IUserContext userContext, CancellationToken cancellationToken) =>
                {
                    request = request with
                    {
                        CreatedByUserId = userContext.GetUserId()
                    };
                    return await mealScheduleSettingService.AddAsync(request).ToMinimalApiResultAsync();
                })
            .WithName("CreateMealScheduleSetting")
            .WithSummary("Create a new meal schedule setting")
            .WithDescription("Create a new meal schedule setting record.")
            .Produces<MealScheduleSettingItem>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
