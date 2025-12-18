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
            string json,
            INonHabitualPurchaseService nonHabitualPurchaseService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var parameters = new Dictionary<string, object>
            {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "json", SqlStringParam.Sanitize(json) }
            };
            var response = await nonHabitualPurchaseService.GetAsync(parameters);
            if (response == null)
                return Results.NoContent();

            return Results.Ok(new { code = "1", payload = response });
        })
            .WithName("GetNonHabitualPurchases")
            .WithSummary("Get all non-habitual purchases")
            .WithDescription("Retrieve a list of non-habitual purchases.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPost("/", async (
            CompraNoHabitualDto compraNoHabitualDto,
            INonHabitualPurchaseService nonHabitualPurchaseService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var parameters = new Dictionary<string, object>
            {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CompraNoHabitualDto>(compraNoHabitualDto)) }
            };
            return Results.Ok(await nonHabitualPurchaseService.AddAsync(parameters));
        })
            .WithName("CreateNonHabitualPurchase")
            .WithSummary("Create a new non-habitual purchase")
            .WithDescription("Create a new non-habitual purchase record.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapPut("/{id:int}", async (
            int id,
            CompraNoHabitualDto compraNoHabitualDto,
            INonHabitualPurchaseService nonHabitualPurchaseService,
            IUserContext userContext,
            CancellationToken cancellationToken) =>
        {
            var parameters = new Dictionary<string, object>
            {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "id", id },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CompraNoHabitualDto>(compraNoHabitualDto)) }
            };
            return Results.Ok(await nonHabitualPurchaseService.UpdateAsync(parameters));
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
            var parameters = new Dictionary<string, object>
            {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "id", id }
            };
            return Results.Ok(await nonHabitualPurchaseService.DeleteAsync(parameters));
        })
            .WithName("DeleteNonHabitualPurchase")
            .WithSummary("Delete a non-habitual purchase")
            .WithDescription("Delete a non-habitual purchase record by its ID.")
            .Produces<object>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
