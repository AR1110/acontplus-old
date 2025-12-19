namespace Purchases.Api.Endpoints.PurchaseOrder;

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
            IPurchaseOrderService purchaseOrderService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            return await purchaseOrderService
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
