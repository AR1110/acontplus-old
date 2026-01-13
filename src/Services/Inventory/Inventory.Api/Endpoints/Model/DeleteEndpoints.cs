namespace Inventory.API.Endpoints.Model;


public static class DeleteEndpoints
{
    public static void MapDeleteEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/models")
            .RequireAuthorization()
            .WithDescription("Endpoints for managing modelos")
            .WithTags("Models");

        group.MapDelete("/{id:int}", async (
            int id,
            IModelService modelService,
            IUserContext userContext) =>
        {
            var parameters = new Dictionary<string, object>
            {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "id", id }
            };
            return Results.Ok(await modelService.DeleteAsync(parameters));
        }).WithDisplayName("Delete Model")
          .WithDescription("Delete a model by its unique identifier.")
          .Produces<SpResponse>(StatusCodes.Status200OK)
          .Produces(StatusCodes.Status401Unauthorized)
          .Produces(StatusCodes.Status403Forbidden);
    }
}
