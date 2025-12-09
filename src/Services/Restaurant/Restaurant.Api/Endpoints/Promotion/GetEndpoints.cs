using Restaurant.Application.Dtos.Promotions;

namespace Restaurant.Api.Endpoints.Promotion;

public static class GetEndpoints
{
    public static void MapGetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/promotions")
            .RequireAuthorization()

            .WithDescription("Endpoints for managing promotions.")
            .WithTags("Promotions");

        group.MapGet("/", async (
                PaginationQuery paginationQuery,
                IPromotionService promotionService,
                IUserContext userContext,
                CancellationToken cancellationToken) =>
            {
                var userRoleId = userContext.GetClaimValue<int>("userRoleId");
                var paginationDto = paginationQuery.Adapt<PaginationRequest>() with
                {
                    SortDirection = paginationQuery.SortDirection ?? SortDirection.Desc
                };

                if (userRoleId != 0)
                {
                    paginationDto = paginationDto.WithFilter("userRoleId", userRoleId);
                }

                return await promotionService.GetAsync(paginationDto).ToGetMinimalApiResultAsync();
            })
            .WithName("GetPromotions")
            .WithSummary("Get all promotions")
            .WithDescription("Retrieve a paginated list of promotions.")
            .Produces<PagedResult<PromotionItem>>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/{id:int}", async (
                int id,
                IPromotionService promotionService,
                IUserContext userContext,
                CancellationToken cancellationToken) =>
            {
                var parameters = new Dictionary<string, object>
                {
                    { "UserRoleId", userContext.GetClaimValue<int>("userRoleId") },
                    { "Id", id }
                };
                return Results.Ok(await promotionService.GetByIdAsync(parameters));
            })
            .WithName("GetPromotionById")
            .WithSummary("Get an Promotion by ID")
            .WithDescription("Retrieve an Promotion record by its ID.")
            .Produces<PromotionItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
