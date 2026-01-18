namespace Configuration.Api.Endpoints.AplicacionEndpoints;

public static class AplicacionEndpoints
{
    public static void MapAplicacionEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/aplicaciones")
            .RequireAuthorization()
            .WithTags("Aplicaciones");

        MapGetEndpoints(group);
        MapCreateEndpoints(group);
        MapUpdateEndpoints(group);
        MapDeleteEndpoints(group);
    }

    private static void MapGetEndpoints(RouteGroupBuilder group)
    {
        group.MapGet("/",
                async (IAplicacionService aplicacionService, CancellationToken cancellationToken) =>
                {
                    return await aplicacionService.GetAllAsync(cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetAllAplicaciones")
            .WithSummary("Get all aplicaciones")
            .WithDescription("Retrieves a list of all Aplicacion resources with caching support.");

        group.MapGet("/{id:int}",
                async (int id, IAplicacionService aplicacionService, CancellationToken cancellationToken) =>
                {
                    return await aplicacionService.GetByIdAsync(id, cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetAplicacionById")
            .WithSummary("Get an aplicacion by ID")
            .WithDescription("Retrieves a single Aplicacion resource by its unique identifier.")
            .Produces<AplicacionItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapCreateEndpoints(RouteGroupBuilder group)
    {
        group.MapPost("/",
                async (AplicacionCreate request, IAplicacionService aplicacionService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    var userId = userContext.GetUserId();
                    return await aplicacionService.AddAsync(request, userId, cancellationToken)
                        .ToMinimalApiResultAsync();
                })
            .WithName("CreateAplicacion")
            .WithSummary("Create a new aplicacion")
            .WithDescription("Creates a new Aplicacion resource. The code and name must be unique.")
            .Produces<AplicacionItem>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/{id:int}",
                async (int id, AplicacionUpdate request, IAplicacionService aplicacionService,
                    IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    var userId = userContext.GetUserId();
                    return await aplicacionService.UpdateAsync(id, request, userId, cancellationToken)
                        .ToMinimalApiResultAsync();
                })
            .WithName("UpdateAplicacion")
            .WithSummary("Update an aplicacion")
            .WithDescription("Updates an existing Aplicacion resource. The code and name must be unique.")
            .Produces<AplicacionItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }

    private static void MapDeleteEndpoints(RouteGroupBuilder group)
    {
        group.MapDelete("/{id:int}",
                async (int id, IAplicacionService aplicacionService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    var userId = userContext.GetUserId();
                    return await aplicacionService.DeleteAsync(id, userId, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("DeleteAplicacion")
            .WithSummary("Delete an aplicacion")
            .WithDescription("Soft deletes an Aplicacion resource.")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }
}
