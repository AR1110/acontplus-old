namespace Configuration.Api.Endpoints.UserRoleEndpoints;

public static class UserRoleEndpoints
{
    public static void MapUserRoleEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/userrole")
            .RequireAuthorization()
            .WithTags("UserRole");

        MapGetEndpoints(group);
        MapCreateEndpoints(group);
        MapUpdateEndpoints(group);
        MapDeleteEndpoints(group);
        MapStatusUpdateEndpoints(group);
    }

    private static void MapGetEndpoints(RouteGroupBuilder group)
    {
        group.MapGet("/{userId}",
                async (int userId, IUserRoleService userRoleService, CancellationToken cancellationToken) =>
                {
                    var parameters = new Dictionary<string, object>
                    {
                        { "userId", userId }
                    };
                    var resp = await userRoleService.GetAsync(parameters);
                    return Results.Ok(resp);
                })
            .WithName("GetUserRole")
            .WithSummary("Get user role")
            .WithDescription("Retrieves user role data by user ID")
            .Produces<List<UserRoleItem>>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapCreateEndpoints(RouteGroupBuilder group)
    {
        group.MapPost("/",
                async (UserRoleItem userRole, IUserRoleService userRoleService) =>
                {
                    var parameters = new Dictionary<string, object>
                    {
                        { "userRoleId", 0 },
                        { "json", userRole.SerializeOptimized() }
                    };
                    var resp = await userRoleService.AddAsync(parameters);
                    return Results.Ok(resp);
                })
            .WithName("CreateUserRole")
            .WithSummary("Create user role")
            .WithDescription("Creates a new user role")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest);
    }

    private static void MapUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/{id:int}",
                async (int id, UserRoleItem userRole, IUserRoleService userRoleService) =>
                {
                    var parameters = new Dictionary<string, object>
                    {
                        { "userRoleId", 0 },
                        { "id", id },
                        { "json", userRole.SerializeOptimized() }
                    };
                    var resp = await userRoleService.UpdateAsync(parameters);
                    return Results.Ok(resp);
                })
            .WithName("UpdateUserRole")
            .WithSummary("Update user role")
            .WithDescription("Updates an existing user role")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest);
    }

    private static void MapDeleteEndpoints(RouteGroupBuilder group)
    {
        group.MapDelete("/{id:int}",
                async (int id, IUserRoleService userRoleService) =>
                {
                    var parameters = new Dictionary<string, object>
                    {
                        { "userRoleId", 0 },
                        { "id", id }
                    };
                    var resp = await userRoleService.DeleteAsync(parameters);
                    return Results.Ok(resp);
                })
            .WithName("DeleteUserRole")
            .WithSummary("Delete user role")
            .WithDescription("Deletes a user role")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest);
    }

    private static void MapStatusUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/{id:int}/{estado}",
                async (int id, bool estado, IUserRoleService userRoleService, IUserContext userContext) =>
                {
                    var resp = await userRoleService.UpdateStatusAsync(userContext.GetUserId(), id, estado);
                    return Results.Ok(resp);
                })
            .WithName("UpdateUserRoleStatus")
            .WithSummary("Update user role status")
            .WithDescription("Updates the status of a user role")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest);
    }
}
