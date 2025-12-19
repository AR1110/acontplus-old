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
            IPurchaseCategoryService purchaseCategoryService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            return await purchaseCategoryService
          .GetAsync(userRoleId, cancellationToken)
          .ToGetMinimalApiResultAsync();
        })
            .WithName("GetPurchaseCategories")
            .WithSummary("Get all purchase categories")
            .WithDescription("Retrieve a list of purchase categories.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
