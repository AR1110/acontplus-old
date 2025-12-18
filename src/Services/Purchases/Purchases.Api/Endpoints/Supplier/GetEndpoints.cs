namespace Purchases.Api.Endpoints.Supplier;

public static class GetEndpoints
{
  public static void MapGetEndpoints(this IEndpointRouteBuilder app)
  {
    var group = app.MapGroup("/api/suppliers")
        .RequireAuthorization()
        .WithDescription("Endpoints for retrieving suppliers.")
        .WithTags("Suppliers");

    group.MapGet("/", async (
        string json,
        ISupplierService supplierService,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "json", SqlStringParam.Sanitize(json) }
        };
      return Results.Ok(await supplierService.GetAsync(parameters));
    })
        .WithName("GetSuppliers")
        .WithSummary("Get all suppliers")
        .WithDescription("Retrieve a list of suppliers.")
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .ProducesProblem(StatusCodes.Status500InternalServerError);
  }
}
