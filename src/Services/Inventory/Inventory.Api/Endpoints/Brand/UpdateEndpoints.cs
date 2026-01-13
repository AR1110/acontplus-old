
namespace Inventory.API.Endpoints.Brand;

public static class UpdateEndpoints
{
    public static void MapUpdateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/brands")
            .RequireAuthorization()
            .WithDescription("Endpoints for managing marcas")
            .WithTags("Brands");

        group.MapPut("/{id:int}", async (
            int id,
            UpdateMarcaDto dto,
            IBrandService brandService,
            IUserContext userContext,
            HttpContext httpContext) =>
        {
            var parameters = new Dictionary<string, object>
            {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "id", id },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateMarcaDto>(dto)) },
                { "fromMobile", httpContext.Items["FromMobile"] as bool? ?? false }
            };
            return Results.Ok(await brandService.UpdateAsync(parameters));
        }).WithDisplayName("Update Brand")
            .WithDescription("Update an existing brand with the provided details.")
            .Produces<SpResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status403Forbidden);
    }
}
