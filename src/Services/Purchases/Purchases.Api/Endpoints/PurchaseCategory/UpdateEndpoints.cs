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
            PurchaseCategoryUpdate request,
            IPurchaseCategoryService purchaseCategoryService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            var requestWithId = request with { Id = id };

            return await purchaseCategoryService
          .UpdateAsync(id, requestWithId, userRoleId, cancellationToken)
          .ToMinimalApiResultAsync();
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
