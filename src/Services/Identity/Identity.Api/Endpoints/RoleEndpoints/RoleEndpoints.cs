namespace Identity.Api.Endpoints.RoleEndpoints;

public static class RoleEndpoints
{
    public static void MapRoleEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/roles")
.RequireAuthorization()
            .WithTags("Roles"); ;

        MapGetEndpoints(group);
        MapCreateEndpoints(group);
        MapUpdateEndpoints(group);
        MapDeleteEndpoints(group);
    }

    private static void MapGetEndpoints(RouteGroupBuilder group)
    {
        group.MapGet("/",
                async (IRoleService roleService, CancellationToken cancellationToken) =>
                {
                    return await roleService.GetAllAsync(cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetAllRoles")
            .WithSummary("Get all roles")
            .WithDescription("Retrieves all active roles")
            .Produces<IReadOnlyList<RoleItem>>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        // TODO: Add paged endpoint when IRoleService supports GetPagedAsync
        // group.MapGet("/paged",
        //         async (IRoleService roleService, [AsParameters] PaginationQuery query,
        //             CancellationToken cancellationToken) =>
        //         {
        //             var PaginationRequest = new PaginationRequest
        //             {
        //                 PageIndex = query.PageIndex,
        //                 PageSize = query.PageSize,
        //                 SortBy = query.SortBy,
        //                 SearchTerm = query.SearchTerm,
        //                 SortDirection = query.SortDirection ?? default
        //             };
        //
        //             return await roleService.GetPagedAsync(PaginationRequest, cancellationToken)
        //                 .ToMinimalApiResultAsync();
        //         })
        //     .WithName("GetPagedRoles")
        //     .WithSummary("Get paged roles")
        //     .WithDescription("Retrieves roles with pagination")
        //     .Produces<IReadOnlyList<RoleItem>>(200)
        //     .ProducesProblem(StatusCodes.Status400BadRequest);

        group.MapGet("/{id:int}",
                async (int id, IRoleService roleService, CancellationToken cancellationToken) =>
                {
                    return await roleService.GetByIdAsync(id, cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetRoleById")
            .WithSummary("Get role by ID")
            .WithDescription("Retrieves a specific role by its ID")
            .Produces<RoleItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapCreateEndpoints(RouteGroupBuilder group)
    {
        group.MapPost("/",
                async (RoleCreate request, IRoleService roleService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    return await roleService.AddAsync(request, userContext.GetUserId(), cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("CreateRole")
            .WithSummary("Create a new role")
            .WithDescription("Creates a new Role resource. The code must be unique.")
            .Produces<RoleCreatedResponse>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/{id:int}",
                async (int id, RoleUpdate request, IRoleService roleService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    return await roleService.UpdateAsync(id, request, userContext.GetUserId(), cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("UpdateRole")
            .WithSummary("Update a role")
            .WithDescription("Updates an existing role resource")
            .Produces<RoleItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }

    private static void MapDeleteEndpoints(RouteGroupBuilder group)
    {
        group.MapDelete("/{id:int}",
                async (int id, IRoleService roleService, CancellationToken cancellationToken) =>
                {
                    return await roleService.DeleteAsync(id, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("DeleteRole")
            .WithSummary("Delete a role")
            .WithDescription("Soft deletes a role resource")
            .Produces<bool>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }
}
