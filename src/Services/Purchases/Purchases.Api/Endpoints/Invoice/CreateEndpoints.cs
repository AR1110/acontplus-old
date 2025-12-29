using Purchases.Application.Dtos.Invoices;

namespace Purchases.Api.Endpoints.Invoice;

public static class CreateEndpoints
{
    public static void MapCreateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/purchase-invoices")
            .RequireAuthorization()
            .WithDescription("Endpoints for creating purchase invoices.")
            .WithTags("Purchase Invoices");

        group.MapPost("/", async (
            InvoiceCreate request,
            IInvoiceService InvoiceService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            var requestWithUserRole = request with { UserRoleId = userRoleId };

            return await InvoiceService
          .AddAsync(requestWithUserRole, cancellationToken)
          .ToMinimalApiResultAsync();
        })
            .WithName("CreatePurchaseInvoice")
            .WithSummary("Create a new purchase invoice")
            .WithDescription("Create a new purchase invoice record.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
