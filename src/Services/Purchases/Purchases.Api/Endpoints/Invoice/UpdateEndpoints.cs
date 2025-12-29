using Purchases.Application.Dtos.Invoices;

namespace Purchases.Api.Endpoints.Invoice;

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
            InvoiceUpdate request,
            IInvoiceService InvoiceService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            var requestWithId = request with { Id = id };

            return await InvoiceService
          .UpdateAsync(id, requestWithId, userRoleId, cancellationToken)
          .ToMinimalApiResultAsync();
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
