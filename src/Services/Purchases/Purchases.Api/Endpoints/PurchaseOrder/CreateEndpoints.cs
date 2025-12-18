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
        OrdenCompraDto ordenCompraDto,
        IPurchaseOrderService purchaseOrderService,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<OrdenCompraDto>(ordenCompraDto)) }
        };
      return Results.Ok(await purchaseOrderService.AddAsync(parameters));
    })
        .WithName("CreatePurchaseOrder")
        .WithSummary("Create a new purchase order")
        .WithDescription("Create a new purchase order record.")
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status500InternalServerError);
  }
}
