namespace Purchases.Api.Endpoints.ReceivedDocumentDetailTemp;

public static class CrudEndpoints
{
  public static void MapCrudEndpoints(this IEndpointRouteBuilder app)
  {
    var group = app.MapGroup("/api/received-document-details-temp")
        .RequireAuthorization()
        .WithDescription("Endpoints for managing temporary received document details.")
        .WithTags("Received Document Details Temp");

    group.MapGet("/{idDocumento:int}", async (
        int idDocumento,
        IDocRecDetailTempRepository detailTempRepository,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "idDocumento", idDocumento },
                { "jsonData", "" }
        };
      return Results.Ok(await detailTempRepository.GetAsync(parameters));
    })
        .WithName("GetReceivedDocumentDetailTemp")
        .WithSummary("Get temporary document details")
        .WithDescription("Retrieve temporary details for a received document.")
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .ProducesProblem(StatusCodes.Status500InternalServerError);

    group.MapPost("/", async (
        DocDetailleTemporalDto data,
        IDocRecDetailTempRepository detailTempRepository,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "jsonData", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<DocDetailleTemporalDto>(data)) }
        };
      return Results.Ok(await detailTempRepository.AddAsync(parameters));
    })
        .WithName("CreateReceivedDocumentDetailTemp")
        .WithSummary("Create temporary document detail")
        .WithDescription("Create a new temporary document detail record.")
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status500InternalServerError);

    group.MapPut("/", async (
        DocDetailleTemporalDto data,
        IDocRecDetailTempRepository detailTempRepository,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "jsonData", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<DocDetailleTemporalDto>(data)) }
        };
      return Results.Ok(await detailTempRepository.UpdateAsync(parameters));
    })
        .WithName("UpdateReceivedDocumentDetailTemp")
        .WithSummary("Update temporary document detail")
        .WithDescription("Update an existing temporary document detail record.")
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .ProducesProblem(StatusCodes.Status500InternalServerError);
  }
}
