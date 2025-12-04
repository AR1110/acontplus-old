using Restaurant.Application.Dtos.Order;

namespace Restaurant.Api.Endpoints;

public static class StatsEndPoints
{
    public static void MapStatsEndpoints(this IEndpointRouteBuilder app)
    {

        var group = app.MapGroup("/api/stats")
           .RequireAuthorization()

           .WithDescription("Endpoints for managing stats.")
           .WithTags("Stats");

        group.MapGet("/", async (
                PaginationQuery paginationQuery,
                IOrderService orderService,
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

            return await orderService.GetAsync(paginationDto).ToGetMinimalApiResultAsync();
        })
            .WithName("GetOrders")
            .WithSummary("Get all orders")
            .WithDescription("Retrieve a paginated list of orders.")
            .Produces<PagedResult<OrderItemDto>>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
