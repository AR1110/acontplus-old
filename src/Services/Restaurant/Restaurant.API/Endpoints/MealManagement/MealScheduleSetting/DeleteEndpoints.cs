namespace Restaurant.Api.Endpoints.MealManagement.MealScheduleSetting;

public static class DeleteEndpoints
{
    public static void MapDeleteEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/meal-schedule-settings")
            .RequireAuthorization()
            .WithOpenApi()
            .WithDescription("Endpoints for managing meal schedule settings records.")
            .WithTags("Meal Schedule Settings");
        group.MapDelete("/{id:int}",
                async (int id, IMealScheduleSettingService mealScheduleSettingService,
                    CancellationToken cancellationToken) =>
                {
                    return await mealScheduleSettingService.DeleteAsync(id).ToMinimalApiResultAsync();
                })
            .WithName("DeleteMealScheduleSetting")
            .WithSummary("Delete a meal schedule setting")
            .WithDescription("Delete a meal schedule setting record by its ID.")
            .Produces(StatusCodes.Status204NoContent)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
