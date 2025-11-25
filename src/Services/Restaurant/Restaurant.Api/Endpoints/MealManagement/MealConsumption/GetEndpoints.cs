namespace Restaurant.Api.Endpoints.MealManagement.MealConsumption;

public static class GetEndpoints
{
    public static void MapGetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/meal-consumptions")
            .RequireAuthorization()
            .WithOpenApi()
            .WithDescription("Endpoints for managing meal consumption records.")
            .WithTags("Meal Consumptions");
        group.MapGet("/",
                async (PaginationQuery paginationQuery, IMealConsumptionService mealConsumptionService,
                    IUserContext userContext, CancellationToken cancellationToken) =>
                {
                    var userRoleId = userContext.GetClaimValue<int>("userRoleId");
                    var paginationDto = paginationQuery.Adapt<PaginationRequest>() with
                    {
                        SortDirection = paginationQuery.SortDirection ?? default
                    };
                    paginationDto.WithFilter("UserRoleId", userRoleId);

                    return await mealConsumptionService.GetAsync(paginationDto, cancellationToken)
                        .ToGetMinimalApiResultAsync();
                })
            .WithName("GetMealConsumptions")
            .WithSummary("Get meal consumptions")
            .WithDescription("Retrieve meal consumptions")
            .Produces<IReadOnlyList<PagedResult<MealConsumptionItem>>>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/search-customer", async (PaginationQuery paginationQuery,
                IMealConsumptionService mealConsumptionService, IUserContext userContext,
                CancellationToken cancellationToken) =>
            {
                var userRoleId = userContext.GetClaimValue<int>("userRoleId");
                var paginationDto = paginationQuery.Adapt<PaginationRequest>() with
                {
                    SortDirection = paginationQuery.SortDirection ?? default
                };
                paginationDto.WithFilter("UserRoleId", userRoleId);

                return await mealConsumptionService.SearchCustomerAsync(paginationDto, cancellationToken)
                    .ToGetMinimalApiResultAsync();
            })
            .WithName("SearchCustomer")
            .WithSummary("Search customer for meal consumption")
            .WithDescription("Retrieve a customer for meal consumption")
            .Produces<IReadOnlyList<PagedResult<CustomerMealConsumptionItem>>>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
