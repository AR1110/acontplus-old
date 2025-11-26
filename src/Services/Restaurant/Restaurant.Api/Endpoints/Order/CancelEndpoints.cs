using Restaurant.Application.Dtos.Order;

namespace Restaurant.Api.Endpoints.Order;

public static class CancelEndpoints
{
    public static void MapCancelEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/orders")
            .RequireAuthorization()
            
            .WithDescription("Endpoints for managing orders.")
            .WithTags("Orders");

        group.MapPut("cancel/{id:int}", async (
                int id,
                OrderUpdate request,
                IOrderService orderService,
                IUserContext userContext,
                CancellationToken cancellationToken) =>
        {
            var parameters = new Dictionary<string, object>
                {
                    { "UserRoleId", userContext.GetClaimValue<int>("userRoleId") },
                    { "Id", id },
                    { "Json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<OrderCancel>(request)) }
                };
            return Results.Ok(await orderService.CancelAsync(parameters));
        })
            .WithName("CancelOrder")
            .WithSummary("Cancel an existing Order")
            .WithDescription("Cancel an existing order record.")
            .Produces<OrderItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
