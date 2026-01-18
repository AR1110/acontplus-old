namespace Common.Api.Endpoints.ReleaseEndpoints;

public static class ReleaseEndpoints
{
    public static void MapReleaseEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/releases")
            .RequireAuthorization()
            .WithTags("Releases");

        MapGetEndpoints(group);
        MapCreateEndpoints(group);
        MapUpdateEndpoints(group);
        MapDeleteEndpoints(group);
    }

    private static void MapGetEndpoints(RouteGroupBuilder group)
    {
        group.MapGet("/",
                async (IReleaseService releaseService, CancellationToken cancellationToken) =>
                {
                    return await releaseService.GetAllAsync(cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetAllReleases")
            .WithSummary("Get all releases")
            .WithDescription("Retrieves all releases")
            .Produces<IReadOnlyList<ReleaseItem>>()
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/{id:int}",
                async (int id, IReleaseService releaseService, CancellationToken cancellationToken) =>
                {
                    return await releaseService.GetByIdAsync(id, cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetReleaseById")
            .WithSummary("Get release by ID")
            .WithDescription("Retrieves a specific release by its ID")
            .Produces<ReleaseItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/by-aplicacion/{aplicacionId:int}",
                async (int aplicacionId, IReleaseService releaseService, CancellationToken cancellationToken) =>
                {
                    return await releaseService.GetByAplicacionIdAsync(aplicacionId, cancellationToken)
                        .ToGetMinimalApiResultAsync();
                })
            .WithName("GetReleasesByAplicacion")
            .WithSummary("Get releases by application ID")
            .WithDescription("Retrieves all releases for a specific application")
            .Produces<IReadOnlyList<ReleaseItem>>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapCreateEndpoints(RouteGroupBuilder group)
    {
        group.MapPost("/",
                async (ReleaseCreate request, IReleaseService releaseService, HttpContext httpContext,
                    CancellationToken cancellationToken) =>
                {
                    var userId = httpContext.User.GetUserId();
                    return await releaseService.AddAsync(request, userId, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("CreateRelease")
            .WithSummary("Create a new release")
            .WithDescription("Creates a new release")
            .Produces<ReleaseCreatedResponse>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status400BadRequest);
    }

    private static void MapUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/{id:int}",
                async (int id, ReleaseUpdate request, IReleaseService releaseService, HttpContext httpContext,
                    CancellationToken cancellationToken) =>
                {
                    var userId = httpContext.User.GetUserId();
                    return await releaseService.UpdateAsync(id, request, userId, cancellationToken)
                        .ToMinimalApiResultAsync();
                })
            .WithName("UpdateRelease")
            .WithSummary("Update an existing release")
            .WithDescription("Updates an existing release")
            .Produces<ReleaseUpdatedResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapDeleteEndpoints(RouteGroupBuilder group)
    {
        group.MapDelete("/{id:int}",
                async (int id, IReleaseService releaseService, HttpContext httpContext,
                    CancellationToken cancellationToken) =>
                {
                    var userId = httpContext.User.GetUserId();
                    return await releaseService.DeleteAsync(id, userId, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("DeleteRelease")
            .WithSummary("Delete a release")
            .WithDescription("Deletes a release")
            .Produces<bool>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }
}
