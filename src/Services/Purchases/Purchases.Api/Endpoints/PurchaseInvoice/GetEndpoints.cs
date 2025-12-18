namespace Purchases.Api.Endpoints.PurchaseInvoice;

public static class GetEndpoints
{
  public static void MapGetEndpoints(this IEndpointRouteBuilder app)
  {
    var group = app.MapGroup("/api/purchase-invoices")
        .RequireAuthorization()
        .WithDescription("Endpoints for retrieving purchase invoices.")
        .WithTags("Purchase Invoices");

    group.MapGet("/", async (
        string json,
        IFacturaCompraRepository facturaCompraRepository,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "json", SqlStringParam.Sanitize(json) }
        };
      var response = await facturaCompraRepository.GetAsync(parameters);
      if (response == null)
        return Results.NoContent();

      return Results.Ok(new { code = "1", payload = response });
    })
        .WithName("GetPurchaseInvoices")
        .WithSummary("Get all purchase invoices")
        .WithDescription("Retrieve a list of purchase invoices.")
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .ProducesProblem(StatusCodes.Status500InternalServerError);

    group.MapGet("/{id:int}", async (
        int id,
        IFacturaCompraRepository facturaCompraRepository,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "id", id }
        };
      var response = await facturaCompraRepository.GetByIdAsync(parameters);
      if (response == null)
        return Results.NoContent();

      return Results.Ok(new { code = "1", payload = response });
    })
        .WithName("GetPurchaseInvoiceById")
        .WithSummary("Get a purchase invoice by ID")
        .WithDescription("Retrieve a purchase invoice record by its ID.")
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .ProducesProblem(StatusCodes.Status500InternalServerError);
  }
}
