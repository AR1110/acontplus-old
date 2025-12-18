namespace Purchases.Api.Endpoints.PurchaseInvoice;

public static class DeleteEndpoints
{
  public static void MapDeleteEndpoints(this IEndpointRouteBuilder app)
  {
    var group = app.MapGroup("/api/purchase-invoices")
        .RequireAuthorization()
        .WithDescription("Endpoints for deleting purchase invoices.")
        .WithTags("Purchase Invoices");

    group.MapDelete("/{id:int}", async (
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
      return Results.Ok(await facturaCompraRepository.DeleteAsync(parameters));
    })
        .WithName("DeletePurchaseInvoice")
        .WithSummary("Delete a purchase invoice")
        .WithDescription("Delete a purchase invoice record by its ID.")
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .ProducesProblem(StatusCodes.Status500InternalServerError);
  }
}
