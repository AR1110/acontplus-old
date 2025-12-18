namespace Purchases.Api.Endpoints.ReceivedDocument;

public static class UpdateEndpoints
{
  public static void MapUpdateEndpoints(this IEndpointRouteBuilder app)
  {
    var group = app.MapGroup("/api/received-documents")
        .RequireAuthorization()
        .WithDescription("Endpoints for updating received documents.")
        .WithTags("Received Documents");

    group.MapPut("/{id:int}", async (
        int id,
        DocumentoRecibidoDto documentoRecibido,
        IReceivedDocumentService receivedDocumentService,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "idDocumento", id },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<DocumentoRecibidoDto>(documentoRecibido)) }
        };
      return Results.Ok(await receivedDocumentService.UpdateAsync(parameters));
    })
        .WithName("UpdateReceivedDocument")
        .WithSummary("Update a received document")
        .WithDescription("Update an existing received document record.")
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .ProducesProblem(StatusCodes.Status500InternalServerError);

    group.MapPut("/migrate", async (
        DocumentoRecibidoMigrateDto data,
        IReceivedDocumentService receivedDocumentService,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<DocumentoRecibidoMigrateDto>(data)) }
        };
      return Results.Ok(await receivedDocumentService.MigrateAsync(parameters));
    })
        .WithName("MigrateReceivedDocument")
        .WithSummary("Migrate a received document")
        .WithDescription("Migrate a received document to another category.")
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status500InternalServerError);

    group.MapPut("/subcategory", async (
        DocumentoRecibidoCategoria data,
        IReceivedDocumentService receivedDocumentService,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<DocumentoRecibidoCategoria>(data)) }
        };
      return Results.Ok(await receivedDocumentService.UpdateSubcategoryAsync(parameters));
    })
        .WithName("UpdateReceivedDocumentSubcategory")
        .WithSummary("Update received document subcategory")
        .WithDescription("Update the subcategory of a received document.")
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status500InternalServerError);
  }
}
