namespace Configuration.Api.Endpoints.UserCustomerEndpoints;

public static class UserCustomerEndpoints
{
    public static void MapUserCustomerEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/usercustomer")
            .RequireAuthorization()
            .WithTags("UserCustomer");

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
                async (IUserCustomerService userCustomerService, PaginationQuery paginationQuery,
                    CancellationToken cancellationToken) =>
                {
                    var PaginationRequest = paginationQuery.Adapt<PaginationRequest>() with
                    {
                        SortDirection = paginationQuery.SortDirection ?? SortDirection.Desc
                    };

                    return await userCustomerService.GetAsync(PaginationRequest, cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetUserCustomers")
            .WithSummary("Get user customers")
            .WithDescription("Retrieves user customers with optional filtering, pagination, and sorting. " +
                           "Use query parameters: searchTerm, pageIndex, pageSize, sortBy, sortDirection, filters")
            .Produces<PagedResult<UserCustomerResponse>>()
            .ProducesProblem(StatusCodes.Status404NotFound);
    }

    private static void MapCreateEndpoints(RouteGroupBuilder group)
    {
        group.MapPost("/",
                async (UserCustomerItem userCustomer, IUserCustomerService userCustomerService) =>
                {
                    var parameters = new Dictionary<string, object>
                    {
                        { "userRoleId", 0 },
                        { "json", userCustomer.SerializeOptimized() }
                    };
                    return await userCustomerService.AddAsync(parameters).ToMinimalApiResultAsync();
                })
            .WithName("CreateUserCustomer")
            .WithSummary("Create user customer")
            .WithDescription("Creates a new user customer")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/{id:int}",
                async (int id, UserCustomerItem userCustomer, IUserCustomerService userCustomerService, IUserContext userContext) =>
                {
                    var parameters = new Dictionary<string, object>
                    {
                        { "updatedBy", userContext.GetUserName() },
                        { "id", id },
                        { "json", DataConverters.SerializeObjectCustom<UserCustomerItem>(userCustomer) }
                    };
                    return await userCustomerService.UpdateAsync(parameters).ToMinimalApiResultAsync();
                })
            .WithName("UpdateUserCustomer")
            .WithSummary("Update user customer")
            .WithDescription("Updates an existing user customer")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapDeleteEndpoints(RouteGroupBuilder group)
    {
        group.MapDelete("/{id:int}",
                async (int id, IUserCustomerService userCustomerService) =>
                {
                    var parameters = new Dictionary<string, object>
                    {
                        { "userRoleId", 0 },
                        { "id", id }
                    };
                    return await userCustomerService.DeleteAsync(parameters).ToMinimalApiResultAsync();
                })
            .WithName("DeleteUserCustomer")
            .WithSummary("Delete user customer")
            .WithDescription("Deletes a user customer")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapPasswordResetEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/PasswordReset/{id:int}",
                async (int id, UserCustomerPassword userCustomerPassword, IUserCustomerService userCustomerService) =>
                {
                    var parameters = new Dictionary<string, object>
                    {
                        { "userRoleId", 0 },
                        { "id", id },
                        { "json", DataConverters.SerializeObjectCustom<UserCustomerPassword>(userCustomerPassword) }
                    };
                    return await userCustomerService.UpdatePasswordAsync(parameters).ToMinimalApiResultAsync();
                })
            .WithName("ResetUserCustomerPassword")
            .WithSummary("Reset user customer password")
            .WithDescription("Resets the password for a user customer")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapStatusUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/{id:int}/{estado}",
                async (int id, bool estado, IUserCustomerService userCustomerService, IUserContext userContext) =>
                {
                    var resp = await userCustomerService.UpdateStatus(userContext.GetUserId(), id, estado);
                    return resp.ToMinimalApiResult();
                })
            .WithName("UpdateUserCustomerStatus")
            .WithSummary("Update user customer status")
            .WithDescription("Updates the status of a user customer")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
