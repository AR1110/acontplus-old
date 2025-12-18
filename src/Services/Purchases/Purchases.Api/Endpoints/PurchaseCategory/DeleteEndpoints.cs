namespace Purchases.Api.Endpoints.PurchaseCategory;

public static class DeleteEndpoints
{
    public static void MapDeleteEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/purchase-categories")
            .RequireAuthorization()
            .WithDescription("Endpoints for deleting purchase categories.")
            .WithTags("Purchase Categories");

        group.MapDelete("/{id:int}", async (
            int id,
            IPurchaseCategoryService purchaseCategoryService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            return await purchaseCategoryService
          .DeleteAsync(id, userRoleId, cancellationToken)
          .ToMinimalApiResultAsync();
        })
            .WithName("DeletePurchaseCategory")
            .WithSummary("Delete a purchase category")
            .WithDescription("Delete a purchase category record by its ID.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
