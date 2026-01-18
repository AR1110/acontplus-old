namespace Configuration.Api.Endpoints.MenuEndpoints;

public static class MenuEndpoints
{
    public static void MapMenuEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/menus")
.RequireAuthorization()
            .WithTags("Menus"); ;

        MapGetEndpoints(group);
        MapCreateEndpoints(group);
        MapUpdateEndpoints(group);
        MapDeleteEndpoints(group);
    }

    private static void MapGetEndpoints(RouteGroupBuilder group)
    {
        group.MapGet("/",
                async (CancellationToken cancellationToken, IMenuService menuService,
                    [FromQuery] bool withApplication = false) =>
                {
                    return withApplication
                        ? await menuService.GetAllWithApplicationAsync(cancellationToken).ToGetMinimalApiResultAsync()
                        : await menuService.GetAllAsync(cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetAllMenus")
            .WithSummary("Get all menus")
            .WithDescription("Retrieves all menus with optional application information")
            .Produces<IReadOnlyList<MenuItem>>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/{id:int}",
                async (int id, IMenuService menuService, CancellationToken cancellationToken) =>
                {
                    return await menuService.GetByIdAsync(id, cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetMenuById")
            .WithSummary("Get menu by ID")
            .WithDescription("Retrieves a specific menu by its ID")
            .Produces<MenuItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapCreateEndpoints(RouteGroupBuilder group)
    {
        group.MapPost("/",
                async (MenuCreate request, IMenuService menuService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    request = request with { CreatedByUserId = userContext.GetUserId() };
                    return await menuService.AddAsync(request, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("CreateMenu")
            .WithSummary("Create a new menu")
            .WithDescription("Creates a new Menu resource. The code must be unique within the application.")
            .Produces<MenuItem>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/{id:int}",
                async (int id, MenuUpdate request, IMenuService menuService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    request = request with { UpdatedByUserId = userContext.GetUserId() };
                    return await menuService.UpdateAsync(id, request, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("UpdateMenu")
            .WithSummary("Update a menu")
            .WithDescription("Updates an existing Menu resource by ID")
            .Produces<MenuItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }

    private static void MapDeleteEndpoints(RouteGroupBuilder group)
    {
        group.MapDelete("/{id:int}",
                async (int id, IMenuService menuService, CancellationToken cancellationToken) =>
                {
                    return await menuService.DeleteAsync(id, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("DeleteMenu")
            .WithSummary("Delete a menu")
            .WithDescription("Deletes a Menu resource by ID")
            .Produces<bool>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }
}
