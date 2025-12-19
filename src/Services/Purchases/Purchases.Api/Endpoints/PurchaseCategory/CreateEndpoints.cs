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
            PurchaseCategoryCreate request,
            IPurchaseCategoryService purchaseCategoryService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            var requestWithUser = request with { CreatedByUserId = userRoleId };

            return await purchaseCategoryService
          .AddAsync(requestWithUser, cancellationToken)
          .ToMinimalApiResultAsync();
        })
            .WithName("CreatePurchaseCategory")
            .WithSummary("Create a new purchase category")
            .WithDescription("Create a new purchase category record.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
