using Restaurant.Application.Dtos.Items;

namespace Restaurant.API.Endpoints.Promotion;

public static class CreateEndpoints
{
    public static void MapUpdateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/promotions")
            .RequireAuthorization()
            .WithOpenApi()
            .WithDescription("Endpoints for managing promotions.")
            .WithTags("promotions");

        group.MapPost("/", async (
            int id,
            UpdateItemRequest request,
            IItemService itemService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var parameters = new Dictionary<string, object>
            {
                { "UserRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "Id", id },
                { "Json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateItemRequest>(request)) }
            };
            return Results.Ok(await itemService.UpdateAsync(parameters));
        });
    }

}
