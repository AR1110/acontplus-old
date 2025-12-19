namespace Purchases.Api.Endpoints.Article;

public static class GetEndpoints
{
    public static void MapGetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/articles")
            .RequireAuthorization()
            .WithDescription("Endpoints for retrieving articles.")
            .WithTags("Articles");

        group.MapGet("/", async (
            IArticleService articleService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            return await articleService
          .GetAsync(userRoleId, cancellationToken)
          .ToGetMinimalApiResultAsync();
        })
            .WithName("GetArticles")
            .WithSummary("Get all articles")
            .WithDescription("Retrieve a list of articles.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
