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
        string json,
        IHabitualPurchaseService habitualPurchaseService,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "json", SqlStringParam.Sanitize(json) }
        };
      return Results.Ok(await habitualPurchaseService.GetAsync(parameters));
    })
        .WithName("GetHabitualPurchases")
        .WithSummary("Get all habitual purchases")
        .WithDescription("Retrieve a list of habitual purchases.")
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .ProducesProblem(StatusCodes.Status500InternalServerError);

    group.MapPost("/", async (
        CompraHabitualDto compraHabitualDto,
        IHabitualPurchaseService habitualPurchaseService,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CompraHabitualDto>(compraHabitualDto)) }
        };
      return Results.Ok(await habitualPurchaseService.AddAsync(parameters));
    })
        .WithName("CreateHabitualPurchase")
        .WithSummary("Create a new habitual purchase")
        .WithDescription("Create a new habitual purchase record.")
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status500InternalServerError);

    group.MapPut("/{id:int}", async (
        int id,
        string json,
        IHabitualPurchaseService habitualPurchaseService,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "id", id },
                { "json", SqlStringParam.Sanitize(json) }
        };
      return Results.Ok(await habitualPurchaseService.UpdateAsync(parameters));
    })
        .WithName("UpdateHabitualPurchase")
        .WithSummary("Update a habitual purchase")
        .WithDescription("Update an existing habitual purchase record.")
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .ProducesProblem(StatusCodes.Status500InternalServerError);

    group.MapDelete("/", async (
        string json,
        IHabitualPurchaseService habitualPurchaseService,
        IUserContext userContext,
        CancellationToken cancellationToken) =>
    {
      var parameters = new Dictionary<string, object>
        {
                { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                { "json", SqlStringParam.Sanitize(json) }
        };
      return Results.Ok(await habitualPurchaseService.DeleteAsync(parameters));
    })
        .WithName("DeleteHabitualPurchase")
        .WithSummary("Delete a habitual purchase")
        .WithDescription("Delete a habitual purchase record.")
        .Produces<object>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound)
        .ProducesProblem(StatusCodes.Status500InternalServerError);
  }
}
