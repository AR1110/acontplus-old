namespace Common.Api.Endpoints.UserManualEndpoints;

public static class UserManualEndpoints
{
    public static void MapUserManualEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/user-manuals")
            .RequireAuthorization()
            .WithTags("User Manuals");

        MapGetEndpoints(group);
        MapCreateEndpoints(group);
        MapUpdateEndpoints(group);
        MapDeleteEndpoints(group);
    }

    private static void MapGetEndpoints(RouteGroupBuilder group)
    {
        group.MapGet("/",
                async (IUserManualService userManualService, PaginationQuery paginationQuery,
                    CancellationToken cancellationToken) =>
                {
                    var PaginationRequest = paginationQuery.Adapt<PaginationRequest>() with
                    {
                        SortDirection = paginationQuery.SortDirection ?? SortDirection.Desc
                    };

                    return await userManualService.GetAsync(PaginationRequest, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("GetUserManuals")
            .WithSummary("Get user manuals")
            .WithDescription("Retrieves user manuals with optional filtering, pagination, and sorting. " +
                           "Use query parameters: searchTerm, pageIndex, pageSize, sortBy, sortDirection, filters")
            .Produces<PagedResult<UserManualItem>>()
            .ProducesProblem(StatusCodes.Status404NotFound);

        group.MapGet("/{id:int}",
                async (int id, IUserManualService userManualService, CancellationToken cancellationToken) =>
                {
                    var query = new PaginationRequest
                    {
                        PageIndex = 1,
                        PageSize = 1,
                        Filters = new Dictionary<string, object> { { "id", id } }
                    };
                    return await userManualService.GetAsync(query, cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetUserManualById")
            .WithSummary("Get user manual by ID")
            .WithDescription("Retrieves a specific user manual by its ID")
            .ProducesProblem(StatusCodes.Status404NotFound);

        group.MapGet("/by-type/{userManualTypeId:int}",
                async (int userManualTypeId, IUserManualService userManualService, PaginationQuery query,
                    CancellationToken cancellationToken) =>
                {
                    var filters = new Dictionary<string, object> { { "userManualTypeId", userManualTypeId } };
                    if (query.Filters != null)
                    {
                        foreach (var filter in query.Filters)
                        {
                            filters[filter.Key] = filter.Value;
                        }
                    }

                    var PaginationRequest = new PaginationRequest
                    {
                        PageIndex = query.PageIndex,
                        PageSize = query.PageSize,
                        SortBy = query.SortBy,
                        SearchTerm = query.SearchTerm,
                        SortDirection = query.SortDirection ?? default,
                        Filters = filters
                    };
                    return await userManualService.GetAsync(PaginationRequest, cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetUserManualsByType")
            .WithSummary("Get user manuals by type ID")
            .WithDescription("Retrieves user manuals of a specific type with pagination")
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/by-menu/{menuId:int}",
                async (int menuId, IUserManualService userManualService, PaginationQuery query,
                    CancellationToken cancellationToken) =>
                {
                    var filters = new Dictionary<string, object> { { "menuId", menuId } };
                    if (query.Filters != null)
                    {
                        foreach (var filter in query.Filters)
                        {
                            filters[filter.Key] = filter.Value;
                        }
                    }

                    var PaginationRequest = new PaginationRequest
                    {
                        PageIndex = query.PageIndex,
                        PageSize = query.PageSize,
                        SortBy = query.SortBy,
                        SearchTerm = query.SearchTerm,
                        SortDirection = query.SortDirection ?? default,
                        Filters = filters
                    };
                    return await userManualService.GetAsync(PaginationRequest, cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetUserManualsByMenu")
            .WithSummary("Get user manuals by menu ID")
            .WithDescription("Retrieves user manuals for a specific menu with pagination");
    }

    private static void MapCreateEndpoints(RouteGroupBuilder group)
    {
        group.MapPost("/",
                async (UserManualCreate request, IUserManualService userManualService, IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    request = request with { CreatedByUserId = userContext.GetUserId() };
                    return await userManualService.AddAsync(request, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("CreateUserManual")
            .WithSummary("Create a new user manual")
            .WithDescription("Creates a new UserManual resource.")
            .Produces<UserManualCreatedResponse>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/{id:int}",
                async (int id, UserManualUpdate request, IUserManualService userManualService,
                    IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    request = request with { UpdatedByUserId = userContext.GetUserId() };
                    return await userManualService.UpdateAsync(id, request, cancellationToken)
                        .ToMinimalApiResultAsync();
                })
            .WithName("UpdateUserManual")
            .WithSummary("Update an existing user manual")
            .WithDescription("Updates an existing UserManual resource.")
            .Produces<UserManualUpdatedResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }

    private static void MapDeleteEndpoints(RouteGroupBuilder group)
    {
        group.MapDelete("/{id:int}",
                async (int id, IUserManualService userManualService, CancellationToken cancellationToken) =>
                {
                    return await userManualService.DeleteAsync(id, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("DeleteUserManual")
            .WithSummary("Delete a user manual")
            .WithDescription("Deletes a UserManual resource.")
            .Produces<bool>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }
}
