namespace Purchases.Api.Endpoints.AdditionalArticleData;

public static class CrudEndpoints
{
  public static void MapCrudEndpoints(this IEndpointRouteBuilder app)
  {
    var group = app.MapGroup("/api/additional-article-data")
        .RequireAuthorization()
        .WithDescription("Endpoints for managing additional article data.")
        .WithTags("Additional Article Data");

    group.MapGet("/", async (
        string json,
        IAdditionalArticleDataService additionalArticleDataService,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "json", SqlStringParam.Sanitize(json) }
        };
      return Results.Ok(await additionalArticleDataService.GetAsync(parameters));
    })
        .WithName("GetAdditionalArticleData")
        .WithSummary("Get all additional article data")
        .WithDescription("Retrieve a list of additional article data.")
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .ProducesProblem(StatusCodes.Status500InternalServerError);

    group.MapPost("/{id:int}", async (
        int id,
        InfoAdicionalDto data,
        IAdditionalArticleDataService additionalArticleDataService,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "idDocumento", id },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<InfoAdicionalDto>(data)) }
        };
      return Results.Ok(await additionalArticleDataService.AddAsync(parameters));
    })
        .WithName("CreateAdditionalArticleData")
        .WithSummary("Create additional article data")
        .WithDescription("Create additional data for an article.")
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status500InternalServerError);

    group.MapDelete("/{idInfoAdicional:int}", async (
        int idInfoAdicional,
        IAdditionalArticleDataService additionalArticleDataService,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "idInfoAdicional", idInfoAdicional }
        };
      return Results.Ok(await additionalArticleDataService.DeleteAsync(parameters));
    })
        .WithName("DeleteAdditionalArticleData")
        .WithSummary("Delete additional article data")
        .WithDescription("Delete additional article data by its ID.")
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .ProducesProblem(StatusCodes.Status500InternalServerError);
  }
}
