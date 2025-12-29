namespace Purchases.Api.Endpoints.Invoice;

public static class GetEndpoints
{
    public static void MapGetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/purchase-invoices")
            .RequireAuthorization()
            .WithDescription("Endpoints for retrieving purchase invoices.")
            .WithTags("Purchase Invoices");

        group.MapGet("/", async (
            PaginationQuery paginationQuery,
            IInvoiceService InvoiceService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            var paginationRequest = paginationQuery.Adapt<PaginationRequest>() with
            {
                SortDirection = paginationQuery.SortDirection ?? SortDirection.Desc
            };

            if (userRoleId != 0)
            {
                paginationRequest = paginationRequest.WithFilter("userRoleId", userRoleId);
            }

            return await InvoiceService
          .GetAsync(paginationRequest, cancellationToken)
          .ToGetMinimalApiResultAsync();
        })
            .WithName("GetPurchaseInvoices")
            .WithSummary("Get all purchase invoices")
            .WithDescription("Retrieve a list of purchase invoices.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/{id:int}", async (
            int id,
            IInvoiceService InvoiceService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            return await InvoiceService
          .GetByIdAsync(id, userRoleId, cancellationToken)
          .ToGetMinimalApiResultAsync();
        })
            .WithName("GetPurchaseInvoiceById")
            .WithSummary("Get a purchase invoice by ID")
            .WithDescription("Retrieve a purchase invoice record by its ID.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
