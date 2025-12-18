namespace Purchases.Api.Endpoints.HabitualPurchase;

public static class CrudEndpoints
{
    public static void MapCrudEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/habitual-purchases")
            .RequireAuthorization()
            .WithDescription("Endpoints for managing habitual purchases.")
            .WithTags("Habitual Purchases");

        group.MapGet("/", async (
            PaginationQuery paginationQuery,
            IHabitualPurchaseService habitualPurchaseService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var paginationRequest = paginationQuery.Adapt<PaginationRequest>() with
            {
                SortDirection = paginationQuery.SortDirection ?? SortDirection.Desc
            };

            return await habitualPurchaseService
          .GetAsync(paginationRequest, cancellationToken)
          .ToGetMinimalApiResultAsync();
        })
            .WithName("GetHabitualPurchases")
            .WithSummary("Get all habitual purchases")
            .WithDescription("Retrieve a list of habitual purchases.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPost("/", async (
            HabitualPurchaseCreate request,
            IHabitualPurchaseService habitualPurchaseService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            var requestWithUser = request with { CreatedByUserId = userRoleId };

            return await habitualPurchaseService
          .AddAsync(requestWithUser, cancellationToken)
          .ToMinimalApiResultAsync();
        })
            .WithName("CreateHabitualPurchase")
            .WithSummary("Create a new habitual purchase")
            .WithDescription("Create a new habitual purchase record.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPut("/{id:int}", async (
            int id,
            HabitualPurchaseUpdate request,
            IHabitualPurchaseService habitualPurchaseService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var requestWithId = request with { Id = id };

            return await habitualPurchaseService
          .UpdateAsync(id, requestWithId, cancellationToken)
          .ToMinimalApiResultAsync();
        })
            .WithName("UpdateHabitualPurchase")
            .WithSummary("Update a habitual purchase")
            .WithDescription("Update an existing habitual purchase record.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapDelete("/{id:int}", async (
            int id,
            IHabitualPurchaseService habitualPurchaseService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var userRoleId = userContext.GetClaimValue<int>("userRoleId");
            return await habitualPurchaseService
          .DeleteAsync(id, userRoleId, cancellationToken)
          .ToMinimalApiResultAsync();
        })
            .WithName("DeleteHabitualPurchase")
            .WithSummary("Delete a habitual purchase")
            .WithDescription("Delete a habitual purchase record.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
