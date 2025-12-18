namespace Purchases.Api.Endpoints.Supplier;

public static class DeleteEndpoints
{
  public static void MapDeleteEndpoints(this IEndpointRouteBuilder app)
  {
    var group = app.MapGroup("/api/suppliers")
        .RequireAuthorization()
        .WithDescription("Endpoints for deleting suppliers.")
        .WithTags("Suppliers");

    group.MapDelete("/{id:int}", async (
        int id,
        ISupplierService supplierService,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "id", id }
        };
      return Results.Ok(await supplierService.DeleteAsync(parameters));
    })
        .WithName("DeleteSupplier")
        .WithSummary("Delete a supplier")
        .WithDescription("Delete a supplier record by its ID.")
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .ProducesProblem(StatusCodes.Status500InternalServerError);
  }
}
