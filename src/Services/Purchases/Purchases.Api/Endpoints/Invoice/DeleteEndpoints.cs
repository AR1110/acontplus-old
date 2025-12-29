namespace Purchases.Api.Endpoints.Invoice;

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
            IInvoiceService InvoiceService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            return await InvoiceService
          .DeleteAsync(id, userRoleId, cancellationToken)
          .ToMinimalApiResultAsync();
        })
            .WithName("DeletePurchaseInvoice")
            .WithSummary("Delete a purchase invoice")
            .WithDescription("Delete a purchase invoice record by its ID.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
