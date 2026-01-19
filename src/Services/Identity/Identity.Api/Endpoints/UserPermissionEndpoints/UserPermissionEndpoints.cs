namespace Identity.Api.Endpoints.UserPermissionEndpoints;

public static class UserPermissionEndpoints
{
    public static void MapUserPermissionEndpoints(this IEndpointRouteBuilder app)
    {
        var apiVersionSet = app.NewApiVersionSet()
            .HasApiVersion(new ApiVersion(3, 0))
            .ReportApiVersions()
            .Build();

        var userPermissionGroup = app.MapGroup("/api/v{version:apiVersion}/UserPermission")
            .WithApiVersionSet(apiVersionSet)
            .MapToApiVersion(new ApiVersion(3, 0))
            .RequireAuthorization()
            .WithTags("UserPermission V3");

        MapGetEndpoints(userPermissionGroup);
        MapCreateEndpoints(userPermissionGroup);
        MapUpdateEndpoints(userPermissionGroup);
    }

    private static void MapGetEndpoints(RouteGroupBuilder group)
    {
        group.MapGet("/",
                async (string json, IUserPermissionService userPermissionService, IUserContext userContext,
                    ILogger<IUserPermissionService> logger) =>
                {
                    try
                    {
                        var parameters = new Dictionary<string, object>
                        {
                            { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                            { "json", SqlStringParam.Sanitize(json) }
                        };

                        var response = await userPermissionService.GetAsync(parameters);
                        return response == null ? Results.NoContent() : Results.Ok(response);
                    }
                    catch (Exception ex)
                    {
                        logger.LogError(ex, "Error retrieving user permissions");
                        return Results.Problem("Internal server error", statusCode: 500);
                    }
                })
            .WithName("GetUserPermissions")
            .WithSummary("Get user permissions")
            .WithDescription("Retrieves user permissions based on provided JSON parameters")
            .Produces<object>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status204NoContent)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapCreateEndpoints(RouteGroupBuilder group)
    {
        group.MapPost("/",
                async (CreateUserPermissionDto data, IUserPermissionService userPermissionService, IUserContext userContext,
                    ILogger<IUserPermissionService> logger) =>
                {
                    try
                    {
                        var parameters = new Dictionary<string, object>
                        {
                            { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CreateUserPermissionDto>(data)) }
                        };

                        var response = await userPermissionService.AddAsync(parameters);
                        return Results.Ok(response);
                    }
                    catch (Exception ex)
                    {
                        logger.LogError(ex, "Error creating user permission");
                        return Results.Problem("Internal server error", statusCode: 500);
                    }
                })
            .WithName("CreateUserPermission")
            .WithSummary("Create user permission")
            .WithDescription("Creates a new user permission")
            .Produces<SpResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/",
                async (UpdateUserPermissionDto data, IUserPermissionService userPermissionService, IUserContext userContext,
                    ILogger<IUserPermissionService> logger) =>
                {
                    try
                    {
                        var parameters = new Dictionary<string, object>
                        {
                            { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateUserPermissionDto>(data)) }
                        };

                        var response = await userPermissionService.UpdateAsync(parameters);
                        return Results.Ok(response);
                    }
                    catch (Exception ex)
                    {
                        logger.LogError(ex, "Error updating user permission");
                        return Results.Problem("Internal server error", statusCode: 500);
                    }
                })
            .WithName("UpdateUserPermission")
            .WithSummary("Update user permission")
            .WithDescription("Updates an existing user permission")
            .Produces<SpResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
