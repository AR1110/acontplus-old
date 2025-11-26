using Restaurant.Application.Dtos.Promotions;

namespace Restaurant.Api.Endpoints.Promotion;

public static class CreateEndpoints
{
    public static void MapCreateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/promotions")
            .RequireAuthorization()
            
            .WithDescription("Endpoints for managing promotions.")
            .WithTags("promotions");

        group.MapPost("/", async (
            PromotionCreate request,
            IPromotionService promotionService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var parameters = new Dictionary<string, object>
            {
                { "UserRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "Json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<PromotionCreate>(request)) }
            };
            return Results.Ok(await promotionService.AddAsync(parameters));
        });
    }
}
