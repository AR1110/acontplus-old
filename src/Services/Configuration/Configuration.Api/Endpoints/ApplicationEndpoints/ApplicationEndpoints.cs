namespace Configuration.Api.Endpoints.ApplicationEndpoints;

public static class ApplicationEndpoints
{
    public static void MapApplicationEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/applications")
            .RequireAuthorization()
            .WithTags("Applications");

        MapGetEndpoints(group);
        MapCreateEndpoints(group);
        MapUpdateEndpoints(group);
        MapDeleteEndpoints(group);
    }

    private static void MapGetEndpoints(RouteGroupBuilder group)
    {
        group.MapGet("/",
                async (IApplicationService applicationService, CancellationToken cancellationToken) =>
                {
                    return await applicationService.GetAllAsync(cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetAllApplications")
            .WithSummary("Get all applications")
            .WithDescription("Retrieves a list of all Application resources with caching support.");

        group.MapGet("/{id:int}",
                async (int id, IApplicationService applicationService, CancellationToken cancellationToken) =>
                {
                    return await applicationService.GetByIdAsync(id, cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetApplicationById")
            .WithSummary("Get an Application by ID")
            .WithDescription("Retrieves a single Application resource by its unique identifier.")
            .Produces<ApplicationItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapCreateEndpoints(RouteGroupBuilder group)
    {
        group.MapPost("/",
                async (ApplicationCreate request, IApplicationService applicationService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    var userId = userContext.GetUserId();
                    return await applicationService.AddAsync(request, userId, cancellationToken)
                        .ToMinimalApiResultAsync();
                })
            .WithName("CreateApplication")
            .WithSummary("Create a new Application")
            .WithDescription("Creates a new Application resource. The code and name must be unique.")
            .Produces<ApplicationItem>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/{id:int}",
                async (int id, ApplicationUpdate request, IApplicationService applicationService,
                    IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    var userId = userContext.GetUserId();
                    return await applicationService.UpdateAsync(id, request, userId, cancellationToken)
                        .ToMinimalApiResultAsync();
                })
            .WithName("UpdateApplication")
            .WithSummary("Update an Application")
            .WithDescription("Updates an existing Application resource. The code and name must be unique.")
            .Produces<ApplicationItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }

    private static void MapDeleteEndpoints(RouteGroupBuilder group)
    {
        group.MapDelete("/{id:int}",
                async (int id, IApplicationService applicationService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    var userId = userContext.GetUserId();
                    return await applicationService.DeleteAsync(id, userId, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("DeleteApplication")
            .WithSummary("Delete an Application")
            .WithDescription("Soft deletes an Application resource.")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }
}
