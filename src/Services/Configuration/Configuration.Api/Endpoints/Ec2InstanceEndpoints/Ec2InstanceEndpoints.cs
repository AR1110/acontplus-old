namespace Configuration.Api.Endpoints.Ec2InstanceEndpoints;

public static class Ec2InstanceEndpoints
{
    public static void MapEc2InstanceEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/ec2-instances")
            .RequireAuthorization()
            .WithTags("EC2 Instances");

        MapGetEndpoints(group);
        MapCreateEndpoints(group);
        MapUpdateEndpoints(group);
        MapDeleteEndpoints(group);
    }

    private static void MapGetEndpoints(RouteGroupBuilder group)
    {
        group.MapGet("/",
                async (IEc2InstanceService ec2InstanceService, CancellationToken cancellationToken) =>
                {
                    return await ec2InstanceService.GetAllAsync(cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetAllEc2Instances")
            .WithSummary("Get all EC2 instances")
            .WithDescription("Retrieves a list of all EC2 instance resources.")
            .Produces<IReadOnlyList<Ec2InstanceItem>>()
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/{id:int}",
                async (int id, IEc2InstanceService ec2InstanceService, CancellationToken cancellationToken) =>
                {
                    return await ec2InstanceService.GetByIdAsync(id, cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetEc2InstanceById")
            .WithSummary("Get an EC2 instance by ID")
            .WithDescription("Retrieves a single EC2 instance resource by its unique identifier.")
            .Produces<Ec2InstanceItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapCreateEndpoints(RouteGroupBuilder group)
    {
        group.MapPost("/",
                async (Ec2InstanceCreate request, IEc2InstanceService ec2InstanceService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    return await ec2InstanceService.AddAsync(request, userContext, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("CreateEc2Instance")
            .WithSummary("Create a new EC2 instance")
            .WithDescription("Creates a new EC2 instance resource. The instance ID must be unique.")
            .Produces<Ec2InstanceItem>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/{id:int}",
                async (int id, Ec2InstanceUpdate request, IEc2InstanceService ec2InstanceService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    return await ec2InstanceService.UpdateAsync(id, request, userContext, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("UpdateEc2Instance")
            .WithSummary("Update an EC2 instance")
            .WithDescription("Updates an existing EC2 instance resource by its unique identifier.")
            .Produces<Ec2InstanceItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound);

        group.MapPut("/external",
                async (List<Ec2InstanceItem> instances, IEc2InstanceService ec2InstanceService,
                    CancellationToken cancellationToken) =>
                {
                    return await ec2InstanceService.UpdateExternalAsync(instances, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("UpdateExternalEc2Instances")
            .WithSummary("Update external EC2 instances")
            .WithDescription("Updates EC2 instances from external sources.")
            .AllowAnonymous()
            .Produces<bool>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapDeleteEndpoints(RouteGroupBuilder group)
    {
        group.MapDelete("/{id:int}",
                async (int id, IEc2InstanceService ec2InstanceService, CancellationToken cancellationToken) =>
                {
                    return await ec2InstanceService.DeleteAsync(id, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("DeleteEc2Instance")
            .WithSummary("Delete an EC2 instance")
            .WithDescription("Deletes an EC2 instance resource by its unique identifier.")
            .Produces(204)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
