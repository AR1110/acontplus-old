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
        ProveedorDto proveedorDto,
        ISupplierService supplierService,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "id", id },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<ProveedorDto>(proveedorDto)) }
        };
      return Results.Ok(await supplierService.UpdateAsync(parameters));
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
