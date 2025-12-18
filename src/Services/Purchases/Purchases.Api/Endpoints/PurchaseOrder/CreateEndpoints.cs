namespace Purchases.Api.Endpoints.PurchaseOrder;

public static class CreateEndpoints
{
    public static void MapCreateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/purchase-orders")
            .RequireAuthorization()
            .WithDescription("Endpoints for creating purchase orders.")
            .WithTags("Purchase Orders");

        group.MapPost("/", async (
            PurchaseOrderCreate request,
            IPurchaseOrderService purchaseOrderService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            var requestWithUser = request with { CreatedByUserId = userRoleId };

            return await purchaseOrderService
          .AddAsync(requestWithUser, cancellationToken)
          .ToMinimalApiResultAsync();
        })
            .WithName("CreatePurchaseOrder")
            .WithSummary("Create a new purchase order")
            .WithDescription("Create a new purchase order record.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
