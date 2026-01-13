namespace Inventory.API.Endpoints.Model;


public static class UpdateEndpoints
{
    public static void MapUpdateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/models")
            .RequireAuthorization()
            .WithDescription("Endpoints for managing modelos")
            .WithTags("Models");

        group.MapPut("/{id:int}", async (
            int id,
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
            return Results.Ok(await modelService.UpdateAsync(parameters));
        }).WithDisplayName("Update Model")
          .WithDescription("Update an existing model with the provided details.")
          .Produces<SpResponse>(StatusCodes.Status200OK)
          .Produces(StatusCodes.Status401Unauthorized)
          .Produces(StatusCodes.Status403Forbidden);
    }
}
