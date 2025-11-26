using Restaurant.Application.Dtos.Promotions;

namespace Restaurant.Api.Endpoints.Promotion;

public static class UpdateEndpoints
{
    public static void MapUpdateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/promotions")
            .RequireAuthorization()
            
            .WithDescription("Endpoints for managing promotions.")
            .WithTags("Promotions");

        group.MapPut("/{id:int}", async (
                int id,
                PromotionUpdate request,
                IPromotionService promotionService,
                IUserContext userContext,
                CancellationToken cancellationToken) =>
            {
                var parameters = new Dictionary<string, object>
                {
                    { "UserRoleId", userContext.GetClaimValue<int>("userRoleId") },
                    { "Id", id },
                    { "Json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<PromotionUpdate>(request)) }
                };
                return Results.Ok(await promotionService.UpdateAsync(parameters));
            })
            .WithName("UpdatePromotion")
            .WithSummary("Update an existing promotion")
            .WithDescription("Update an existing promotion record.")
            .Produces<PromotionItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
