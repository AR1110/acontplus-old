using Acontplus.Core.DTOs.Responses;
using Mapster;

namespace Restaurant.API.Endpoints.MealManagement.MealConsumption;

public static class GetEndpoints
{
    public static void MapGetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/meal-consumptions")
            .RequireAuthorization()
            .WithOpenApi()
            .WithDescription("Endpoints for managing meal consumption records.")
            .WithTags("Meal Consumptions");
        group.MapGet("/", async (PaginationQuery paginationQuery, IMealConsumptionService mealConsumptionService, CancellationToken cancellationToken) =>
        {
            var paginationDto = paginationQuery.Adapt<PaginationDto>() with
            {
                SortDirection = paginationQuery.SortDirection ?? default
            };
            return await mealConsumptionService.GetAsync(paginationDto).ToGetMinimalApiResultAsync();
        })
            .WithName("GetMealConsumptionById")
            .WithSummary("Get a meal consumption by ID")
            .WithDescription("Retrieve a meal consumption record by its ID.")
            .Produces<IReadOnlyList<PagedResult<MealConsumptionResponse>>>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}

