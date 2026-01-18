namespace Configuration.Api.Endpoints.SistemaEndpoints;

public static class SistemaEndpoints
{
    public static void MapSistemaEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/sistemas")
            .RequireAuthorization()
            .WithTags("Sistemas");

        MapGetEndpoints(group);
        MapCreateEndpoints(group);
        MapUpdateEndpoints(group);
        MapDeleteEndpoints(group);
    }

    private static void MapGetEndpoints(RouteGroupBuilder group)
    {
        group.MapGet("/",
                async (ISistemaService sistemaService, CancellationToken cancellationToken) =>
                {
                    return await sistemaService.GetAllAsync(cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetAllSistemas")
            .WithSummary("Get all sistemas")
            .WithDescription("Retrieves a list of all Sistema resources with caching support.");

        group.MapGet("/{id:int}",
                async (int id, ISistemaService sistemaService, CancellationToken cancellationToken) =>
                {
                    return await sistemaService.GetByIdAsync(id, cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetSistemaById")
            .WithSummary("Get a sistema by ID")
            .WithDescription("Retrieves a single Sistema resource by its unique identifier.")
            .Produces<SistemaItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapCreateEndpoints(RouteGroupBuilder group)
    {
        group.MapPost("/",
                async (SistemaCreate request, ISistemaService sistemaService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    var userId = userContext.GetUserId();
                    return await sistemaService.AddAsync(request, userId, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("CreateSistema")
            .WithSummary("Create a new sistema")
            .WithDescription("Creates a new Sistema resource. The code and name must be unique.")
            .Produces<SistemaItem>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/{id:int}",
                async (int id, SistemaUpdate request, ISistemaService sistemaService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    var userId = userContext.GetUserId();
                    return await sistemaService.UpdateAsync(id, request, userId, cancellationToken)
                        .ToMinimalApiResultAsync();
                })
            .WithName("UpdateSistema")
            .WithSummary("Update an existing sistema")
            .WithDescription("Updates an existing Sistema resource. The code and name must be unique.")
            .Produces<SistemaItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }

    private static void MapDeleteEndpoints(RouteGroupBuilder group)
    {
        group.MapDelete("/{id:int}",
                async (int id, ISistemaService sistemaService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    var userId = userContext.GetUserId();
                    return await sistemaService.DeleteAsync(id, userId, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("DeleteSistema")
            .WithSummary("Delete a sistema")
            .WithDescription("Soft deletes a Sistema resource. Cannot delete if it has associated aplicaciones.")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }
}
