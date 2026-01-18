namespace Configuration.Api.Endpoints.MenuActionEndpoints;

public static class MenuActionEndpoints
{
    public static void MapMenuActionEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/menu-actions")
.RequireAuthorization()
            .WithTags("Menu Actions"); ;

        MapGetEndpoints(group);
        MapCreateEndpoints(group);
        MapUpdateEndpoints(group);
        MapDeleteEndpoints(group);
    }

    private static void MapGetEndpoints(RouteGroupBuilder group)
    {
        group.MapGet("/",
                async (IMenuActionService menuActionService, CancellationToken cancellationToken) =>
                {
                    return await menuActionService.GetAllWithIncludesAsync(cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetAllMenuActions")
            .WithSummary("Get all menu actions")
            .WithDescription("Retrieves a list of all MenuAction resources, including related menu and action details.")
            .Produces<IReadOnlyList<MenuActionItem>>()
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/{id:int}",
                async (int id, IMenuActionService menuActionService, CancellationToken cancellationToken) =>
                {
                    return await menuActionService.GetByIdWithIncludesAsync(id, cancellationToken)
                        .ToMinimalApiResultAsync();
                })
            .WithName("GetMenuActionById")
            .WithSummary("Get a menu action by ID")
            .WithDescription(
                "Retrieves a single MenuAction resource by its unique identifier, including related menu and action details.")
            .Produces<MenuActionItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapCreateEndpoints(RouteGroupBuilder group)
    {
        group.MapPost("/",
                async (MenuActionCreate request, IMenuActionService menuActionService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    request = request with { CreatedByUserId = userContext.GetUserId() };
                    return await menuActionService.AddAsync(request, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("CreateMenuAction")
            .WithSummary("Create a new menu action")
            .WithDescription("Creates a new MenuAction resource. The combination of menu and action must be unique.")
            .Produces<MenuActionItem>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/{id:int}",
                async (int id, MenuActionUpdate request, IMenuActionService menuActionService,
                    IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    request = request with { UpdatedByUserId = userContext.GetUserId() };
                    return await menuActionService.UpdateAsync(id, request, cancellationToken)
                        .ToMinimalApiResultAsync();
                })
            .WithName("UpdateMenuAction")
            .WithSummary("Update a menu action by ID")
            .WithDescription(
                "Updates an existing MenuAction resource by its unique identifier. The combination of menu and action must remain unique.")
            .Produces<MenuActionItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }

    private static void MapDeleteEndpoints(RouteGroupBuilder group)
    {
        group.MapDelete("/{id:int}",
                async (int id, IMenuActionService menuActionService, CancellationToken cancellationToken) =>
                {
                    return await menuActionService.DeleteAsync(id, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("DeleteMenuAction")
            .WithSummary("Delete a menu action by ID")
            .WithDescription("Deletes an existing MenuAction resource by its unique identifier.")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
