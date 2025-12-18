namespace Purchases.Api.Endpoints.PurchaseCategory;

public static class CreateEndpoints
{
  public static void MapCreateEndpoints(this IEndpointRouteBuilder app)
  {
    var group = app.MapGroup("/api/purchase-categories")
        .RequireAuthorization()
        .WithDescription("Endpoints for creating purchase categories.")
        .WithTags("Purchase Categories");

    group.MapPost("/", async (
        string json,
        ICategoriaCompraRepository categoriaCompraRepository,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "json", SqlStringParam.Sanitize(json) }
        };
      return Results.Ok(await categoriaCompraRepository.AddAsync(parameters));
    })
        .WithName("CreatePurchaseCategory")
        .WithSummary("Create a new purchase category")
        .WithDescription("Create a new purchase category record.")
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status500InternalServerError);
  }
}
