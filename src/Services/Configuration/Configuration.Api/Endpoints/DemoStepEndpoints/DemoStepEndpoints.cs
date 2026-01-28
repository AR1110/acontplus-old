namespace Configuration.Api.Endpoints.DemoStepEndpoints;

using IDemoStepService = Configuration.Application.Interfaces.IDemoStepService;

public static class DemoStepEndpoints
{
    public static void MapDemoStepEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/demo-steps")
            .RequireAuthorization()
            .WithTags("Demo Steps");

        MapGetEndpoints(group);
        MapCreateEndpoints(group);
        MapUpdateEndpoints(group);
        MapDeleteEndpoints(group);
    }

    private static void MapGetEndpoints(RouteGroupBuilder group)
    {
        group.MapGet("/",
                async (IDemoStepService demoStepService, CancellationToken cancellationToken) =>
                {
                    return await demoStepService.GetAllAsync(cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetAllDemoSteps")
            .WithSummary("Get all demo steps")
            .WithDescription("Retrieves a list of all DemoStep resources.")
            .Produces<IReadOnlyList<DemoStepItem>>()
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/{id:int}",
                async (int id, IDemoStepService demoStepService, CancellationToken cancellationToken) =>
                {
                    return await demoStepService.GetByIdAsync(id, cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetDemoStepById")
            .WithSummary("Get a demo step by ID")
            .WithDescription("Retrieves a single DemoStep resource by its unique identifier.")
            .Produces<DemoStepItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapCreateEndpoints(RouteGroupBuilder group)
    {
        group.MapPost("/",
                async (DemoStepCreate request, IDemoStepService demoStepService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    return await demoStepService.AddAsync(request, userContext, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("CreateDemoStep")
            .WithSummary("Create a new demo step")
            .WithDescription("Creates a new DemoStep resource. The code must be unique.")
            .Produces<DemoStepItem>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/{id:int}",
                async (int id, DemoStepUpdate request, IDemoStepService demoStepService,
                    IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    return await demoStepService.UpdateAsync(id, request, userContext, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("UpdateDemoStep")
            .WithSummary("Update a demo step by ID")
            .WithDescription(
                "Updates an existing DemoStep resource by its unique identifier. The code must remain unique.")
            .Produces<DemoStepItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }

    private static void MapDeleteEndpoints(RouteGroupBuilder group)
    {
        group.MapDelete("/{id:int}",
                async (int id, IDemoStepService demoStepService, CancellationToken cancellationToken) =>
                {
                    return await demoStepService.DeleteAsync(id, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("DeleteDemoStep")
            .WithSummary("Delete a demo step by ID")
            .WithDescription("Deletes an existing DemoStep resource by its unique identifier.")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
