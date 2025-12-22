namespace Purchases.Api.Endpoints.NonHabitualPurchase;

public static class CrudEndpoints
{
    public static void MapCrudEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/non-habitual-purchases")
            .RequireAuthorization()
            .WithDescription("Endpoints for managing non-habitual purchases.")
            .WithTags("Non-Habitual Purchases");

        group.MapGet("/", async (
            PaginationQuery paginationQuery,
            INonHabitualPurchaseService nonHabitualPurchaseService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var paginationRequest = paginationQuery.Adapt<PaginationRequest>() with
            {
                SortDirection = paginationQuery.SortDirection ?? SortDirection.Desc
            };

            return await nonHabitualPurchaseService
                .GetAsync(paginationRequest, cancellationToken)
                .ToGetMinimalApiResultAsync();
        })
            .WithName("GetNonHabitualPurchases")
            .WithSummary("Get all non-habitual purchases")
            .WithDescription("Retrieve a list of non-habitual purchases.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPost("/", async (
            NonHabitualPurchaseCreate request,
            INonHabitualPurchaseService nonHabitualPurchaseService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            var requestWithUserRole = request with { UserRoleId = userRoleId };

            return await nonHabitualPurchaseService
                .AddAsync(requestWithUserRole, cancellationToken)
                .ToMinimalApiResultAsync();
        })
            .WithName("CreateNonHabitualPurchase")
            .WithSummary("Create a new non-habitual purchase")
            .WithDescription("Create a new non-habitual purchase record.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPut("/{id:int}", async (
            int id,
            NonHabitualPurchaseUpdate request,
            INonHabitualPurchaseService nonHabitualPurchaseService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var requestWithId = request with { Id = id };

            return await nonHabitualPurchaseService
                .UpdateAsync(id, requestWithId, cancellationToken)
                .ToMinimalApiResultAsync();
        })
            .WithName("UpdateNonHabitualPurchase")
            .WithSummary("Update a non-habitual purchase")
            .WithDescription("Update an existing non-habitual purchase record.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapDelete("/{id:int}", async (
            int id,
            INonHabitualPurchaseService nonHabitualPurchaseService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            return await nonHabitualPurchaseService
                .DeleteAsync(id, userRoleId, cancellationToken)
                .ToMinimalApiResultAsync();
        })
            .WithName("DeleteNonHabitualPurchase")
            .WithSummary("Delete a non-habitual purchase")
            .WithDescription("Delete a non-habitual purchase record by its ID.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
