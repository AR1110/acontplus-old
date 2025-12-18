namespace Purchases.Api.Endpoints.PurchaseCategory;

public static class GetEndpoints
{
  public static void MapGetEndpoints(this IEndpointRouteBuilder app)
  {
    var group = app.MapGroup("/api/purchase-categories")
        .RequireAuthorization()
        .WithDescription("Endpoints for retrieving purchase categories.")
        .WithTags("Purchase Categories");

    group.MapGet("/", async (
        string json,
        IPurchaseCategoryService purchaseCategoryService,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "json", SqlStringParam.Sanitize(json) }
        };
      return Results.Ok(await purchaseCategoryService.GetAsync(parameters));
    })
        .WithName("GetPurchaseCategories")
        .WithSummary("Get all purchase categories")
        .WithDescription("Retrieve a list of purchase categories.")
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .ProducesProblem(StatusCodes.Status500InternalServerError);
  }
}
