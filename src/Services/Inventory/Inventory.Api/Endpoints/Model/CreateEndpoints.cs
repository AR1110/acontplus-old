namespace Inventory.API.Endpoints.Model;

public static class CreateEndpoints
{
    public static void MapCreateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/models")
            .RequireAuthorization()
            .WithDescription("Endpoints for managing modelos")
            .WithTags("Models");

        group.MapPost("/", async (
            ModeloDto dto,
            IModelService modelService,
            IUserContext userContext,
            HttpContext httpContext) =>
        {
            var parameters = new Dictionary<string, object>
            {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<ModeloDto>(dto)) },
                { "fromMobile", httpContext.Items["FromMobile"] as bool? ?? false }
            };
            return Results.Ok(await modelService.AddAsync(parameters));
        }).WithDisplayName("Create Model")
          .WithDescription("Create a new model with the provided details.")
          .Produces<SpResponse>(StatusCodes.Status200OK)
          .Produces(StatusCodes.Status401Unauthorized)
          .Produces(StatusCodes.Status403Forbidden);
    }
}
