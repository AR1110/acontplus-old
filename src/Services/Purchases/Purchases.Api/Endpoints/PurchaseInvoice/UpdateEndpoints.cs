namespace Purchases.Api.Endpoints.PurchaseInvoice;

public static class UpdateEndpoints
{
  public static void MapUpdateEndpoints(this IEndpointRouteBuilder app)
  {
    var group = app.MapGroup("/api/purchase-invoices")
        .RequireAuthorization()
        .WithDescription("Endpoints for updating purchase invoices.")
        .WithTags("Purchase Invoices");

    group.MapPut("/{id:int}", async (
        int id,
        FacturaCompraDto facturaCompraDto,
        IPurchaseInvoiceService purchaseInvoiceService,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "id", id },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<FacturaCompraDto>(facturaCompraDto)) }
        };
      return Results.Ok(await purchaseInvoiceService.UpdateAsync(parameters));
    })
        .WithName("UpdatePurchaseInvoice")
        .WithSummary("Update a purchase invoice")
        .WithDescription("Update an existing purchase invoice record.")
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .ProducesProblem(StatusCodes.Status500InternalServerError);
  }
}
