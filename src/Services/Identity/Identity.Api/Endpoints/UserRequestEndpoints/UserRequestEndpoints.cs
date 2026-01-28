namespace Identity.Api.Endpoints.UserRequestEndpoints;

public static class UserRequestEndpoints
{
    public static void MapUserRequestEndpoints(this IEndpointRouteBuilder app)
    {
        var apiVersionSet = app.NewApiVersionSet()
            .HasApiVersion(new ApiVersion(3, 0))
            .ReportApiVersions()
            .Build();

        var userRequestGroup = app.MapGroup("/api/v{version:apiVersion}/UserRequest")
            .WithApiVersionSet(apiVersionSet)
            .MapToApiVersion(new ApiVersion(3, 0))
            .RequireAuthorization()
            .WithTags("UserRequest V3");

        MapGetEndpoints(userRequestGroup);
        MapCreateEndpoints(userRequestGroup);
        MapUpdateEndpoints(userRequestGroup);
    }

    private static void MapGetEndpoints(RouteGroupBuilder group)
    {
        group.MapGet("/",
                async (string json, IUserRequestService userRequestService, IUserContext userContext,
                    ILogger<IUserRequestService> logger) =>
                {
                    try
                    {
                        var parameters = new Dictionary<string, object>
                        {
                            { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                            { "json", SqlStringParam.Sanitize(json) }
                        };

                        var response = await userRequestService.GetAsync(parameters);
                        return response == null ? Results.NoContent() : Results.Ok(response);
                    }
                    catch (Exception ex)
                    {
                        logger.LogError(ex, "Error retrieving user requests");
                        return Results.Problem("Internal server error", statusCode: 500);
                    }
                })
            .WithName("GetUserRequests")
            .WithSummary("Get user requests")
            .WithDescription("Retrieves user requests based on provided JSON parameters")
            .Produces<object>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status204NoContent)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapCreateEndpoints(RouteGroupBuilder group)
    {
        group.MapPost("/",
                async (CreateUserRequestDto data, IUserRequestService userRequestService, IUserContext userContext,
                    ILogger<IUserRequestService> logger) =>
                {
                    try
                    {
                        var parameters = new Dictionary<string, object>
                        {
                            { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<CreateUserRequestDto>(data)) }
                        };

                        var response = await userRequestService.AddAsync(parameters);
                        return Results.Ok(response);
                    }
                    catch (Exception ex)
                    {
                        logger.LogError(ex, "Error creating user request");
                        return Results.Problem("Internal server error", statusCode: 500);
                    }
                })
            .WithName("CreateUserRequest")
            .WithSummary("Create user request")
            .WithDescription("Creates a new user request")
            .Produces<SpResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/",
                async (UpdateUserRequestDto data, IUserRequestService userRequestService, IUserContext userContext,
                    ILogger<IUserRequestService> logger) =>
                {
                    try
                    {
                        var parameters = new Dictionary<string, object>
                        {
                            { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                            { "json", SqlStringParam.Sanitize(DataConverters.SerializeObjectCustom<UpdateUserRequestDto>(data)) }
                        };

                        var response = await userRequestService.UpdateAsync(parameters);
                        return response == null ? Results.NoContent() : Results.Ok(response);
                    }
                    catch (Exception ex)
                    {
                        logger.LogError(ex, "Error updating user request");
                        return Results.Problem("Internal server error", statusCode: 500);
                    }
                })
            .WithName("UpdateUserRequest")
            .WithSummary("Update user request")
            .WithDescription("Updates an existing user request")
            .Produces<SpResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status204NoContent)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
