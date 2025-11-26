using Restaurant.Application.Dtos.Order;

namespace Restaurant.Api.Endpoints.Order;

public static class UpdateEndpoints
{
    public static void MapUpdateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/orders")
            .RequireAuthorization()
            
            .WithDescription("Endpoints for managing orders.")
            .WithTags("Orders");

        group.MapPut("/{id:int}", async (
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
                    { "Json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<OrderUpdate>(request)) }
                };
            return Results.Ok(await orderService.UpdateAsync(parameters));
        })
            .WithName("UpdateOrder")
            .WithSummary("Update an existing Order")
            .WithDescription("Update an existing order record.")
            .Produces<OrderItemTestDto>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
