namespace Inventory.API.Endpoints.Brand;

public static class GetEndpoints
{
    public static void MapGetEndpoints(this IEndpointRouteBuilder app)
    {

        var group = app.MapGroup("/api/brands")
            .RequireAuthorization()
            .WithDescription("Endpoints for managing marcas")
            .WithTags("Brands");


        group.MapGet("/", async (
            string json,
            IBrandService brandService,
            IUserContext userContext) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            var parameters = new Dictionary<string, object>
            {
                { "userRoleId", userRoleId },
                { "json", SqlStringParam.Sanitize(json) }
            };

            return Results.Ok(await brandService.GetAsync(parameters));
        }).WithDisplayName("Get Brands")
          .WithDescription("Retrieve a list of brands based on provided filters.")
          .Produces<SpResponse>(StatusCodes.Status200OK)
          .Produces(StatusCodes.Status401Unauthorized)
          .Produces(StatusCodes.Status403Forbidden);

    }
}
