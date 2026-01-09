namespace Inventory.API.Endpoints.Brand;

public static class DeleteEndpoints
{
    public static void MapDeleteEndpoints(this IEndpointRouteBuilder app)
    {

        var group = app.MapGroup("/api/brands")
            .RequireAuthorization()
            .WithDescription("Endpoints for managing marcas")
            .WithTags("Brands");

        group.MapDelete("/{id:int}", async (
            int id,
            IBrandService brandService,
            IUserContext userContext) =>
        {
            var parameters = new Dictionary<string, object>
            {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "id", id }
            };
            return Results.Ok(await brandService.DeleteAsync(parameters));
        }).WithDisplayName("Delete Brand")
            .WithDescription("Delete a brand by its ID.")
            .Produces<SpResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status403Forbidden);
    }
}
