namespace Purchases.Api.Endpoints.PurchaseOrder;

public static class UpdateEndpoints
{
    public static void MapUpdateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/purchase-orders")
            .RequireAuthorization()
            .WithDescription("Endpoints for updating purchase orders.")
            .WithTags("Purchase Orders");

        group.MapPut("/{id:int}", async (
            int id,
            PurchaseOrderUpdate request,
            IPurchaseOrderService purchaseOrderService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            var requestWithId = request with { Id = id };

            return await purchaseOrderService
          .UpdateAsync(id, requestWithId, userRoleId, cancellationToken)
          .ToMinimalApiResultAsync();
        })
            .WithName("UpdatePurchaseOrder")
            .WithSummary("Update a purchase order")
            .WithDescription("Update an existing purchase order record.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
