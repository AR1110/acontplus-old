namespace Identity.Api.Endpoints.PolicyTypeEndpoints;

public static class PolicyTypeEndpoints
{
    public static void MapPolicyTypeEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/policy-types")
            .RequireAuthorization()
            .WithTags("Policy Types");

        MapGetEndpoints(group);
        MapCreateEndpoints(group);
        MapUpdateEndpoints(group);
        MapDeleteEndpoints(group);
    }

    private static void MapGetEndpoints(RouteGroupBuilder group)
    {
        group.MapGet("/",
                async (IPolicyTypeService policyTypeService, CancellationToken cancellationToken) =>
                {
                    return await policyTypeService.GetAllAsync(cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetAllPolicyTypes")
            .WithSummary("Get all policy types")
            .WithDescription("Retrieves a list of all PolicyType resources.")
            .Produces<IReadOnlyList<PolicyTypeItem>>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound);

        group.MapGet("/{id:int}",
                async (int id, IPolicyTypeService policyTypeService, CancellationToken cancellationToken) =>
                {
                    return await policyTypeService.GetByIdAsync(id, cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetPolicyTypeById")
            .WithSummary("Get a policy type by ID")
            .WithDescription("Retrieves a single PolicyType resource by its unique identifier.")
            .Produces<PolicyTypeItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/test",
                () =>
                {
                    return Result<object, DomainError>.Success(new { message = "PolicyType API is working", timestamp = DateTime.UtcNow }).ToGetMinimalApiResult();
                })
            .WithName("TestPolicyTypeApi")
            .WithSummary("Test endpoint")
            .WithDescription("Simple test endpoint to verify API is working.")
            .AllowAnonymous();
    }

    private static void MapCreateEndpoints(RouteGroupBuilder group)
    {
        group.MapPost("/",
                async (PolicyTypeCreate request, IPolicyTypeService policyTypeService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    request = request with { CreatedByUserId = userContext.GetUserId() };
                    return await policyTypeService.AddAsync(request, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("CreatePolicyType")
            .WithSummary("Create a new policy type")
            .WithDescription("Creates a new PolicyType resource. The code must be unique.")
            .Produces<PolicyTypeItem>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status400BadRequest);
    }

    private static void MapUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/{id:int}",
                async (int id, PolicyTypeUpdate request, IPolicyTypeService policyTypeService,
                    IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    request = request with { UpdatedByUserId = userContext.GetUserId() };
                    return await policyTypeService.UpdateAsync(id, request, cancellationToken)
                        .ToMinimalApiResultAsync();
                })
            .WithName("UpdatePolicyType")
            .WithSummary("Update a policy type by ID")
            .WithDescription(
                "Updates an existing PolicyType resource by its unique identifier. The code must remain unique.")
            .Produces<PolicyTypeItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapDeleteEndpoints(RouteGroupBuilder group)
    {
        group.MapDelete("/{id:int}",
                async (int id, IPolicyTypeService policyTypeService, CancellationToken cancellationToken) =>
                {
                    return await policyTypeService.DeleteAsync(id, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("DeletePolicyType")
            .WithSummary("Delete a policy type by ID")
            .WithDescription("Deletes an existing PolicyType resource by its unique identifier.")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
