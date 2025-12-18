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
        string json,
        IPurchaseOrderService purchaseOrderService,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "json", SqlStringParam.Sanitize(json) }
        };
      return Results.Ok(await purchaseOrderService.GetAsync(parameters));
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
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "id", id }
        };
      return Results.Ok(await purchaseOrderService.GetByIdAsync(parameters));
    })
        .WithName("GetPurchaseOrderById")
        .WithSummary("Get a purchase order by ID")
        .WithDescription("Retrieve a purchase order record by its ID.")
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .ProducesProblem(StatusCodes.Status500InternalServerError);
  }
}
