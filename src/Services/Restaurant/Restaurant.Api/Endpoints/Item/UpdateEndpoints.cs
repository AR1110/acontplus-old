namespace Restaurant.Api.Endpoints.Item;

public static class UpdateEndpoints
{
    public static void MapUpdateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/items")
            .RequireAuthorization()

            .WithDescription("Endpoints for managing items.")
            .WithTags("Items");

        group.MapPut("/{id:int}", async (
                int id,
                ItemUpdate request,
                IItemService itemService,
                IUserContext userContext,
                CancellationToken cancellationToken) =>
            {
                var parameters = new Dictionary<string, object>
                {
                    { "UserRoleId", userContext.GetClaimValue<int>("userRoleId") },
                    { "Id", id },
                    { "Json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<ItemUpdate>(request)) }
                };
                return Results.Ok(await itemService.UpdateAsync(parameters));
            })
            .WithName("UpdateItem")
            .WithSummary("Update an existing item")
            .WithDescription("Update an existing item record.")
            .Produces<ItemItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
