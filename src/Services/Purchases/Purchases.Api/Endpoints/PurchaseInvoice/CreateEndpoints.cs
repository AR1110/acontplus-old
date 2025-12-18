namespace Purchases.Api.Endpoints.PurchaseInvoice;

public static class CreateEndpoints
{
  public static void MapCreateEndpoints(this IEndpointRouteBuilder app)
  {
    var group = app.MapGroup("/api/purchase-invoices")
        .RequireAuthorization()
        .WithDescription("Endpoints for creating purchase invoices.")
        .WithTags("Purchase Invoices");

    group.MapPost("/", async (
        FacturaCompraDto facturaCompraDto,
        IPurchaseInvoiceService purchaseInvoiceService,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<FacturaCompraDto>(facturaCompraDto)) }
        };
      return Results.Ok(await purchaseInvoiceService.AddAsync(parameters));
    })
        .WithName("CreatePurchaseInvoice")
        .WithSummary("Create a new purchase invoice")
        .WithDescription("Create a new purchase invoice record.")
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status500InternalServerError);
  }
}
