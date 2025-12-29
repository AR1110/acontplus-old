namespace Purchases.Api.Endpoints.Order;

public static class DeleteEndpoints
{
    public static void MapDeleteEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/purchase-orders")
            .RequireAuthorization()
            .WithDescription("Endpoints for deleting purchase orders.")
            .WithTags("Purchase Orders");

        group.MapDelete("/{id:int}", async (
            int id,
            IOrderService OrderService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            return await OrderService
          .DeleteAsync(id, userRoleId, cancellationToken)
          .ToMinimalApiResultAsync();
        })
            .WithName("DeletePurchaseOrder")
            .WithSummary("Delete a purchase order")
            .WithDescription("Delete a purchase order record by its ID.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
