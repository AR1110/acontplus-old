namespace Purchases.Api.Endpoints.ReceivedDocument;

public static class DeleteEndpoints
{
    public static void MapDeleteEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/received-documents")
            .RequireAuthorization()
            .WithDescription("Endpoints for deleting received documents.")
            .WithTags("Received Documents");

        group.MapDelete("/{id:int}", async (
            int id,
            IReceivedDocumentService receivedDocumentService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            return await receivedDocumentService
          .DeleteAsync(id, userRoleId, cancellationToken)
          .ToMinimalApiResultAsync();
        })
            .WithName("DeleteReceivedDocument")
            .WithSummary("Delete a received document")
            .WithDescription("Delete a received document record by its ID.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
