using Restaurant.Application.Dtos.Order;

namespace Restaurant.Api.Endpoints.Order;

public static class CreateEndpoints
{
    public static void MapCreateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/orders")
            .RequireAuthorization()

            .WithDescription("Endpoints for managing orders.")
            .WithTags("orders");

        group.MapPost("/", async (
            OrderCreate request,
            IOrderService orderService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var parameters = new Dictionary<string, object>
            {
                { "UserRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "Json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<OrderCreate>(request)) }
            };
            return Results.Ok(await orderService.AddAsync(parameters));
        });

    }
}
