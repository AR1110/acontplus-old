namespace Purchases.Api.Endpoints.Supplier;

public static class CreateEndpoints
{
    public static void MapCreateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/suppliers")
            .RequireAuthorization()
            .WithDescription("Endpoints for creating suppliers.")
            .WithTags("Suppliers");

        group.MapPost("/", async (
            SupplierCreate request,
            ISupplierService supplierService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            var requestWithUser = request with { CreatedByUserId = userRoleId };

            return await supplierService
          .AddAsync(requestWithUser, cancellationToken)
          .ToMinimalApiResultAsync();
        })
            .WithName("CreateSupplier")
            .WithSummary("Create a new supplier")
            .WithDescription("Create a new supplier record.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
