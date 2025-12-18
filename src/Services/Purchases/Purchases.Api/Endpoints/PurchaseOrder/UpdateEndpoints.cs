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
        OrdenCompraDto ordenCompraDto,
        IPurchaseOrderService purchaseOrderService,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "id", id },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<OrdenCompraDto>(ordenCompraDto)) }
        };
      return Results.Ok(await purchaseOrderService.UpdateAsync(parameters));
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
