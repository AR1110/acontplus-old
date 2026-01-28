namespace Configuration.Api.Endpoints.SystemEndpoints;

public static class SystemEndpoints
{
    public static void MapSystemEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/systems")
            .RequireAuthorization()
            .WithTags("Systems");

        MapGetEndpoints(group);
        MapCreateEndpoints(group);
        MapUpdateEndpoints(group);
        MapDeleteEndpoints(group);
    }

    private static void MapGetEndpoints(RouteGroupBuilder group)
    {
        group.MapGet("/",
                async (ISystemService systemService, CancellationToken cancellationToken) =>
                {
                    return await systemService.GetAllAsync(cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetAllSystems")
            .WithSummary("Get all systems")
            .WithDescription("Retrieves a list of all System resources with caching support.");

        group.MapGet("/{id:int}",
                async (int id, ISystemService systemService, CancellationToken cancellationToken) =>
                {
                    return await systemService.GetByIdAsync(id, cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetSystemById")
            .WithSummary("Get a System by ID")
            .WithDescription("Retrieves a single System resource by its unique identifier.")
            .Produces<SystemItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapCreateEndpoints(RouteGroupBuilder group)
    {
        group.MapPost("/",
                async (SystemCreate request, ISystemService systemService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    var userId = userContext.GetUserId();
                    return await systemService.AddAsync(request, userId, cancellationToken)
                        .ToMinimalApiResultAsync();
                })
            .WithName("CreateSystem")
            .WithSummary("Create a new System")
            .WithDescription("Creates a new System resource. The code and name must be unique.")
            .Produces<SystemItem>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/{id:int}",
                async (int id, SystemUpdate request, ISystemService systemService,
                    IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    var userId = userContext.GetUserId();
                    return await systemService.UpdateAsync(id, request, userId, cancellationToken)
                        .ToMinimalApiResultAsync();
                })
            .WithName("UpdateSystem")
            .WithSummary("Update a System")
            .WithDescription("Updates an existing System resource. The code and name must be unique.")
            .Produces<SystemItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }

    private static void MapDeleteEndpoints(RouteGroupBuilder group)
    {
        group.MapDelete("/{id:int}",
                async (int id, ISystemService systemService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    var userId = userContext.GetUserId();
                    return await systemService.DeleteAsync(id, userId, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("DeleteSystem")
            .WithSummary("Delete a System")
            .WithDescription("Soft deletes a System resource.")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }
}
