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
            IReceivedDocumentDetailTempService receivedDocumentDetailTempService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            return await receivedDocumentDetailTempService
          .GetAsync(idDocumento, userRoleId, cancellationToken)
          .ToGetMinimalApiResultAsync();
        })
            .WithName("GetReceivedDocumentDetailTemp")
            .WithSummary("Get temporary document details")
            .WithDescription("Retrieve temporary details for a received document.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPost("/", async (
            object data,
            IReceivedDocumentDetailTempService receivedDocumentDetailTempService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            return await receivedDocumentDetailTempService
          .AddAsync(data, cancellationToken)
          .ToMinimalApiResultAsync();
        })
            .WithName("CreateReceivedDocumentDetailTemp")
            .WithSummary("Create temporary document detail")
            .WithDescription("Create a new temporary document detail record.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPut("/{id:int}", async (
            int id,
            object data,
            IReceivedDocumentDetailTempService receivedDocumentDetailTempService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            return await receivedDocumentDetailTempService
          .UpdateAsync(id, data, cancellationToken)
          .ToMinimalApiResultAsync();
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
