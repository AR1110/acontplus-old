namespace Configuration.Api.Endpoints.UserCustomerRoleEndpoints;

public static class UserCustomerRoleEndpoints
{
    public static void MapUserCustomerRoleEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/usercustomerrole")
            .RequireAuthorization()
            .WithTags("UserCustomerRole");

        MapGetEndpoints(group);
        MapCreateEndpoints(group);
        MapUpdateEndpoints(group);
        MapDeleteEndpoints(group);
        MapStatusUpdateEndpoints(group);
    }

    private static void MapGetEndpoints(RouteGroupBuilder group)
    {
        group.MapGet("/{userId}",
                async (int userId, IUserCustomerRoleService userCustomerRoleService, CancellationToken cancellationToken) =>
                {
                    var resp = await userCustomerRoleService.GetAsync(userId);
                    return resp.ToGetMinimalApiResult();
                })
            .WithName("GetUserCustomerRole")
            .WithSummary("Get user customer role")
            .WithDescription("Retrieves user customer role data by user ID")
            .Produces<List<UserCustomerRoleItem>>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapCreateEndpoints(RouteGroupBuilder group)
    {
        group.MapPost("/",
                async (UserCustomerRoleItem userCustomerRole, IUserCustomerRoleService userCustomerRoleService) =>
                {
                    var parameters = new Dictionary<string, object>
                    {
                        { "userRoleId", 0 },
                        { "json", userCustomerRole.SerializeOptimized() }
                    };
                    var resp = await userCustomerRoleService.AddAsync(parameters);
                    return resp.ToMinimalApiResult();
                })
            .WithName("CreateUserCustomerRole")
            .WithSummary("Create user customer role")
            .WithDescription("Creates a new user customer role")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest);
    }

    private static void MapUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/{id:int}",
                async (int id, UserCustomerRoleItem userCustomerRole, IUserCustomerRoleService userCustomerRoleService) =>
                {
                    var parameters = new Dictionary<string, object>
                    {
                        { "userRoleId", 0 },
                        { "id", id },
                        { "json", userCustomerRole.SerializeOptimized() }
                    };
                    var resp = await userCustomerRoleService.UpdateAsync(parameters);
                    return resp.ToMinimalApiResult();
                })
            .WithName("UpdateUserCustomerRole")
            .WithSummary("Update user customer role")
            .WithDescription("Updates an existing user customer role")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest);
    }

    private static void MapDeleteEndpoints(RouteGroupBuilder group)
    {
        group.MapDelete("/{id:int}",
                async (int id, IUserCustomerRoleService userCustomerRoleService) =>
                {
                    var parameters = new Dictionary<string, object>
                    {
                        { "userRoleId", 0 },
                        { "id", id }
                    };
                    var resp = await userCustomerRoleService.DeleteAsync(parameters);
                    return resp.ToMinimalApiResult();
                })
            .WithName("DeleteUserCustomerRole")
            .WithSummary("Delete user customer role")
            .WithDescription("Deletes a user customer role")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest);
    }

    private static void MapStatusUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/{id:int}/{estado}",
                async (int id, bool estado, IUserCustomerRoleService userCustomerRoleService, IUserContext userContext) =>
                {
                    var resp = await userCustomerRoleService.UpdateStatusAsync(userContext.GetUserId(), id, estado);
                    return resp.ToMinimalApiResult();
                })
            .WithName("UpdateUserCustomerRoleStatus")
            .WithSummary("Update user customer role status")
            .WithDescription("Updates the status of a user customer role")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest);
    }
}
