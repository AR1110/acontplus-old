using Acontplus.Core.DTOs.Responses;
using Acontplus.Core.Enums;
using Acontplus.Core.Extensions;
using Mapster;
using Restaurant.Application.Dtos.Items;

namespace Restaurant.API.Endpoints.Item;

public static class GetEndpoints
{
    public static void MapGetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/items")
            .RequireAuthorization()
            .WithOpenApi()
            .WithDescription("Endpoints for managing items.")
            .WithTags("Items");

        group.MapGet("/", async (
            PaginationQuery paginationQuery,
            IItemService itemService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");

            var paginationDto = paginationQuery.Adapt<PaginationDto>() with
            {
                SortDirection = paginationQuery.SortDirection ?? SortDirection.Desc
            };

            if (userRoleId != 0)
            {
                paginationDto = paginationDto.WithFilter("userRoleId", userRoleId);
            }

            return await itemService.GetAsync(paginationDto).ToGetMinimalApiResultAsync();
        })
            .WithName("GetItems")
            .WithSummary("Get all items")
            .WithDescription("Retrieve a paginated list of items.")
            .Produces<PagedResult<ItemListResponse>>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/{id:int}", async (
            int id,
            IItemService itemService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var parameters = new Dictionary<string, object>
            {
                { "UserRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "Id", id }
            };
            return Results.Ok(await itemService.GetByIdAsync(parameters));
        })
            .WithName("GetItemById")
            .WithSummary("Get an item by ID")
            .WithDescription("Retrieve an item record by its ID.")
            .Produces<ItemResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
