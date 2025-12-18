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
        IDocumentDetailService documentDetailService,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "idDocumento", idDocumento },
                { "idArticulo", idArticulo }
        };
      return Results.Ok(await documentDetailService.AddAsync(parameters));
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
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "id", id }
        };
      return Results.Ok(await documentDetailService.DeleteAsync(parameters));
    })
        .WithName("DeleteDocumentDetail")
        .WithSummary("Delete a document detail")
        .WithDescription("Delete a document detail record by its ID.")
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .ProducesProblem(StatusCodes.Status500InternalServerError);
  }
}
