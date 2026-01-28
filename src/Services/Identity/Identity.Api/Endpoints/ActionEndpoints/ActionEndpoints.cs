namespace Identity.Api.Endpoints.ActionEndpoints;

public static class ActionEndpoints
{
    public static void MapActionEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/actions")
            .RequireAuthorization()
            .WithTags("Actions");

        MapGetEndpoints(group);
        MapCreateEndpoints(group);
        MapUpdateEndpoints(group);
        MapDeleteEndpoints(group);
    }

    private static void MapGetEndpoints(RouteGroupBuilder group)
    {
        group.MapGet("/",
                async (IActionService actionService, CancellationToken cancellationToken) =>
                {
                    return await actionService.GetAllAsync(cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetAllActions")
            .WithSummary("Get all actions")
            .WithDescription("Retrieves a list of all Action resources.");

        group.MapGet("/{id:int}",
                async (int id, IActionService actionService, CancellationToken cancellationToken) =>
                {
                    return await actionService.GetByIdAsync(id, cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetActionById")
            .WithSummary("Get an action by ID")
            .WithDescription("Retrieves a single Action resource by its unique identifier.")
            .Produces<ActionItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapCreateEndpoints(RouteGroupBuilder group)
    {
        group.MapPost("/",
                async (ActionCreate request, IActionService actionService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    request = request with { CreatedByUserId = userContext.GetUserId() };
                    return await actionService.AddAsync(request, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("CreateAction")
            .WithSummary("Create a new action")
            .WithDescription("Creates a new Action resource. The code and name must be unique.")
            .Produces<ActionItem>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/{id:int}",
                async (int id, ActionUpdate request, IActionService actionService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    request = request with { UpdatedByUserId = userContext.GetUserId() };
                    return await actionService.UpdateAsync(id, request, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("UpdateAction")
            .WithSummary("Update an action by ID")
            .WithDescription(
                "Updates an existing Action resource by its unique identifier. The code and name must remain unique.")
            .Produces<ActionItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }

    private static void MapDeleteEndpoints(RouteGroupBuilder group)
    {
        group.MapDelete("/{id:int}",
                async (int id, IActionService actionService,
                    CancellationToken cancellationToken) =>
                {
                    return await actionService.DeleteAsync(id, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("DeleteAction")
            .WithSummary("Delete an action by ID")
            .WithDescription("Deletes an existing Action resource by its unique identifier.")
            .Produces<ActionItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }
}
