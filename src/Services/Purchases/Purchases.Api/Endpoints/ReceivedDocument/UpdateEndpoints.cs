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
            ReceivedDocumentUpdate request,
            IReceivedDocumentService receivedDocumentService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            var requestWithId = request with { Id = id };

            return await receivedDocumentService
          .UpdateAsync(id, requestWithId, userRoleId, cancellationToken)
          .ToMinimalApiResultAsync();
        })
            .WithName("UpdateReceivedDocument")
            .WithSummary("Update a received document")
            .WithDescription("Update an existing received document record.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPut("/migrate", async (
            ReceivedDocumentMigrate request,
            IReceivedDocumentService receivedDocumentService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            var requestWithUserRole = request with { UserRoleId = userRoleId };

            return await receivedDocumentService
          .MigrateAsync(requestWithUserRole, cancellationToken)
          .ToMinimalApiResultAsync();
        })
            .WithName("MigrateReceivedDocument")
            .WithSummary("Migrate a received document")
            .WithDescription("Migrate a received document to another category.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPut("/subcategory/{id:int}", async (
            int id,
            ReceivedDocumentCategoryUpdate request,
            IReceivedDocumentService receivedDocumentService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var requestWithId = request with { Id = id };

            return await receivedDocumentService
          .UpdateSubcategoryAsync(id, requestWithId, cancellationToken)
          .ToMinimalApiResultAsync();
        })
            .WithName("UpdateReceivedDocumentSubcategory")
            .WithSummary("Update received document subcategory")
            .WithDescription("Update the subcategory of a received document.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
