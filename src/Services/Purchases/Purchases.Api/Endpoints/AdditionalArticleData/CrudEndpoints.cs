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
            IAdditionalArticleDataService additionalArticleDataService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            return await additionalArticleDataService
          .GetAsync(userRoleId, cancellationToken)
          .ToGetMinimalApiResultAsync();
        })
            .WithName("GetAdditionalArticleData")
            .WithSummary("Get all additional article data")
            .WithDescription("Retrieve a list of additional article data.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPost("/{id:int}", async (
            int id,
            AdditionalArticleDataCreate request,
            IAdditionalArticleDataService additionalArticleDataService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            var requestWithContext = request with { DocumentId = id, CreatedByUserId = userRoleId };

            return await additionalArticleDataService
          .AddAsync(requestWithContext, cancellationToken)
          .ToMinimalApiResultAsync();
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
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            return await additionalArticleDataService
          .DeleteAsync(idInfoAdicional, userRoleId, cancellationToken)
          .ToMinimalApiResultAsync();
        })
            .WithName("DeleteAdditionalArticleData")
            .WithSummary("Delete additional article data")
            .WithDescription("Delete additional article data by its ID.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
