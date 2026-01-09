namespace Inventory.API.Endpoints.Brand;

public static class CreateEndpoints
{
    public static void MapCreateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/brands")
            .RequireAuthorization()
            .WithDescription("Endpoints for managing marcas")
            .WithTags("Brands");

        group.MapPost("/", async (
            MarcaDto dto,
            IBrandService brandService,
            IUserContext userContext,
            HttpContext httpContext) =>
        {
            var parameters = new Dictionary<string, object>
            {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<MarcaDto>(dto)) },
                { "fromMobile", httpContext.Items["FromMobile"] as bool? ?? false }
            };
            return Results.Ok(await brandService.AddAsync(parameters));
        }).WithDisplayName("Create Brand")
            .WithDescription("Create a new brand with the provided details.")
            .Produces<SpResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status403Forbidden);
    }
}
