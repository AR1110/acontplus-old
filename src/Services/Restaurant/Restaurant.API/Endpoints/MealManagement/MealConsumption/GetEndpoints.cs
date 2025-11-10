using Acontplus.Core.DTOs.Responses;

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
            var paginationDto = new PaginationDto
            {
                PageIndex = paginationQuery.PageIndex,
                PageSize = paginationQuery.PageSize,
                SortBy = paginationQuery.SortBy,
                SortDirection = paginationQuery.SortDirection ?? default,
                Filters = paginationQuery.Filters
            };
            return await mealConsumptionService.GetAsync(paginationDto).ToMinimalApiResultAsync();
        })
            .WithName("GetMealConsumptionById")
            .WithSummary("Get a meal consumption by ID")
            .WithDescription("Retrieve a meal consumption record by its ID.")
            .Produces<IReadOnlyList<PagedResult<MealConsumptionItem>>>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}

