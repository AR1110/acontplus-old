namespace Purchases.Api.Endpoints.PurchaseCategory;

public static class UpdateEndpoints
{
  public static void MapUpdateEndpoints(this IEndpointRouteBuilder app)
  {
    var group = app.MapGroup("/api/purchase-categories")
        .RequireAuthorization()
        .WithDescription("Endpoints for updating purchase categories.")
        .WithTags("Purchase Categories");

    group.MapPut("/{id:int}", async (
        int id,
        string json,
        IPurchaseCategoryService purchaseCategoryService,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "id", id },
                { "json", SqlStringParam.Sanitize(json) }
        };
      return Results.Ok(await purchaseCategoryService.UpdateAsync(parameters));
    })
        .WithName("UpdatePurchaseCategory")
        .WithSummary("Update a purchase category")
        .WithDescription("Update an existing purchase category record.")
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .ProducesProblem(StatusCodes.Status500InternalServerError);
  }
}
