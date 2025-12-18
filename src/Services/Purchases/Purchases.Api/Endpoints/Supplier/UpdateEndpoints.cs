namespace Purchases.Api.Endpoints.Supplier;

public static class UpdateEndpoints
{
    public static void MapUpdateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/suppliers")
            .RequireAuthorization()
            .WithDescription("Endpoints for updating suppliers.")
            .WithTags("Suppliers");

        group.MapPut("/{id:int}", async (
            int id,
            SupplierUpdate request,
            ISupplierService supplierService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            var requestWithId = request with { Id = id };

            return await supplierService
          .UpdateAsync(id, requestWithId, userRoleId, cancellationToken)
          .ToMinimalApiResultAsync();
        })
            .WithName("UpdateSupplier")
            .WithSummary("Update a supplier")
            .WithDescription("Update an existing supplier record.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
