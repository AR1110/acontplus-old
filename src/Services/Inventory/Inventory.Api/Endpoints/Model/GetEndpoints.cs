namespace Inventory.API.Endpoints.Model;

public static class GetEndpoints
{
    public static void MapGetEndpoints(this IEndpointRouteBuilder app)
    {

        var group = app.MapGroup("/api/models")
            .RequireAuthorization()
            .WithDescription("Endpoints for managing modelos")
            .WithTags("Models");

        group.MapGet("/", async (
            string json,
            IModelService modelService,
            IUserContext userContext) =>
        {
            var parameters = new Dictionary<string, object>
            {
                    { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                    { "json", SqlStringParam.Sanitize(json) }
            };
            return Results.Ok(await modelService.GetAsync(parameters));

        }).WithDisplayName("Get Models")
          .WithDescription("Retrieve a list of models based on provided filters.")
          .Produces<SpResponse>(StatusCodes.Status200OK)
          .Produces(StatusCodes.Status401Unauthorized)
          .Produces(StatusCodes.Status403Forbidden);
    }
}

