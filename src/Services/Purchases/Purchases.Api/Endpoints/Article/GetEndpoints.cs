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
        string json,
        IArticuloRepository articuloRepository,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "jsonData", SqlStringParam.Sanitize(json) }
        };
      return Results.Ok(await articuloRepository.GetAsync(parameters));
    })
        .WithName("GetArticles")
        .WithSummary("Get all articles")
        .WithDescription("Retrieve a list of articles.")
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .ProducesProblem(StatusCodes.Status500InternalServerError);
  }
}
