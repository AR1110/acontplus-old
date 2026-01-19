namespace Identity.Api.Endpoints.UserEndpoints;

public static class UserEndpoints
{
    public static void MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/user")
            .RequireAuthorization()
            .WithTags("User");

        MapGetEndpoints(group);
        MapCreateEndpoints(group);
        MapUpdateEndpoints(group);
        MapDeleteEndpoints(group);
        MapPasswordResetEndpoints(group);
        MapStatusUpdateEndpoints(group);
    }

    private static void MapGetEndpoints(RouteGroupBuilder group)
    {
        group.MapGet("/",
                async (IUserManagementService userService, PaginationQuery paginationQuery,
                    CancellationToken cancellationToken) =>
                {
                    var PaginationRequest = paginationQuery.Adapt<PaginationRequest>() with
                    {
                        SortDirection = paginationQuery.SortDirection ?? SortDirection.Desc
                    };

                    return await userService.GetPaginatedAsync(PaginationRequest, cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetUsers")
            .WithSummary("Get users")
            .WithDescription("Retrieves users with optional filtering, pagination, and sorting. " +
                           "Use query parameters: searchTerm, pageIndex, pageSize, sortBy, sortDirection, filters")
            .Produces<PagedResult<UserResponse>>()
            .ProducesProblem(StatusCodes.Status404NotFound);
    }

    private static void MapCreateEndpoints(RouteGroupBuilder group)
    {
        group.MapPost("/",
                async (UserItem user, IUserManagementService userService) =>
                {
                    var parameters = new Dictionary<string, object>
                    {
                        { "userRoleId", 0 },
                        { "json", user.SerializeOptimized() }
                    };
                    return await userService.AddUserAsync(parameters).ToMinimalApiResultAsync();
                })
            .WithName("CreateUser")
            .WithSummary("Create user")
            .WithDescription("Creates a new user")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/{id:int}",
                async (int id, UserItem user, IUserManagementService userService, IUserContext userContext) =>
                {
                    var parameters = new Dictionary<string, object>
                    {
                        { "updatedBy", userContext.GetUserName() },
                        { "id", id },
                        { "json", DataConverters.SerializeObjectCustom<UserItem>(user) }
                    };
                    return await userService.UpdateUserAsync(parameters).ToMinimalApiResultAsync();
                })
            .WithName("UpdateUser")
            .WithSummary("Update user")
            .WithDescription("Updates an existing user")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapDeleteEndpoints(RouteGroupBuilder group)
    {
        group.MapDelete("/{id:int}",
                async (int id, IUserManagementService userService) =>
                {
                    var parameters = new Dictionary<string, object>
                    {
                        { "userRoleId", 0 },
                        { "id", id }
                    };
                    return await userService.DeleteAsync(parameters).ToMinimalApiResultAsync();
                })
            .WithName("DeleteUser")
            .WithSummary("Delete user")
            .WithDescription("Deletes a user")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapPasswordResetEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/PasswordReset/{id:int}",
                async (int id, UserPassword userPassword, IUserManagementService userService) =>
                {
                    var parameters = new Dictionary<string, object>
                    {
                        { "userRoleId", 0 },
                        { "id", id },
                        { "json", DataConverters.SerializeObjectCustom<UserPassword>(userPassword) }
                    };
                    return await userService.UpdatePasswordAsync(parameters).ToMinimalApiResultAsync();
                })
            .WithName("ResetUserPassword")
            .WithSummary("Reset user password")
            .WithDescription("Resets the password for a user")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapStatusUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/{id:int}/{estado}",
                async (int id, bool estado, IUserManagementService userService, IUserContext userContext) =>
                {
                    var resp = await userService.UpdateStatus(userContext.GetUserId(), id, estado);
                    return resp.ToMinimalApiResult();
                })
            .WithName("UpdateUserStatus")
            .WithSummary("Update user status")
            .WithDescription("Updates the status of a user")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
