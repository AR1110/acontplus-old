namespace Purchases.Api.Endpoints.DocumentDetail;

public static class CrudEndpoints
{
    public static void MapCrudEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/document-details")
            .RequireAuthorization()
            .WithDescription("Endpoints for managing document details.")
            .WithTags("Document Details");

        group.MapPost("/{idDocumento:int}/{idArticulo:int}", async (
            int idDocumento,
            int idArticulo,
            object request,
            IDocumentDetailService documentDetailService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var payload = new { DocumentId = idDocumento, ArticleId = idArticulo, Data = request };
            return await documentDetailService
          .AddAsync(payload, cancellationToken)
          .ToMinimalApiResultAsync();
        })
            .WithName("CreateDocumentDetail")
            .WithSummary("Create a document detail")
            .WithDescription("Create a new document detail record.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapDelete("/{id:int}", async (
            int id,
            IDocumentDetailService documentDetailService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            return await documentDetailService
          .DeleteAsync(id, userRoleId, cancellationToken)
          .ToMinimalApiResultAsync();
        })
            .WithName("DeleteDocumentDetail")
            .WithSummary("Delete a document detail")
            .WithDescription("Delete a document detail record by its ID.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
