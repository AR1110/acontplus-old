namespace Purchases.Api.Endpoints.PurchaseOrder;

public static class GetEndpoints
{
    public static void MapGetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/purchase-orders")
            .RequireAuthorization()
            .WithDescription("Endpoints for retrieving purchase orders.")
            .WithTags("Purchase Orders");

        group.MapGet("/", async (
            PaginationQuery paginationQuery,
            IPurchaseOrderService purchaseOrderService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            var paginationRequest = paginationQuery.Adapt<PaginationRequest>() with
            {
                SortDirection = paginationQuery.SortDirection ?? SortDirection.Desc
            };

            if (userRoleId != 0)
            {
                paginationRequest = paginationRequest.WithFilter("userRoleId", userRoleId);
            }

            return await purchaseOrderService
          .GetAsync(paginationRequest, cancellationToken)
          .ToGetMinimalApiResultAsync();
        })
            .WithName("GetPurchaseOrders")
            .WithSummary("Get all purchase orders")
            .WithDescription("Retrieve a list of purchase orders.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/{id:int}", async (
            int id,
            IPurchaseOrderService purchaseOrderService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            return await purchaseOrderService
          .GetByIdAsync(id, userRoleId, cancellationToken)
          .ToGetMinimalApiResultAsync();
        })
            .WithName("GetPurchaseOrderById")
            .WithSummary("Get a purchase order by ID")
            .WithDescription("Retrieve a purchase order record by its ID.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
