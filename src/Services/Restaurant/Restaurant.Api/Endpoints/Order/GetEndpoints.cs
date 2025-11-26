using Restaurant.Application.Dtos.Order;

namespace Restaurant.Api.Endpoints.Order;

public static class GetEndpoints
{
    public static void MapGetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/orders")
            .RequireAuthorization()
            .WithOpenApi()
            .WithDescription("Endpoints for managing orders.")
            .WithTags("Orders");

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
            .Produces<PagedResult<OrderItemTestDto>>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/{id:int}", async (
                int id,
                IOrderService orderService,
                IUserContext userContext,
                CancellationToken cancellationToken) =>
        {
            var parameters = new Dictionary<string, object>
                {
                    { "UserRoleId", userContext.GetClaimValue<int>("userRoleId") },
                    { "Id", id }
                };
            return Results.Ok(await orderService.GetByIdAsync(parameters));
        })
            .WithName("GetOrderById")
            .WithSummary("Get an Order by ID")
            .WithDescription("Retrieve an Order record by its ID.")
            .Produces<OrderItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

}
