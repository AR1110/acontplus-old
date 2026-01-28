namespace Common.Api.Endpoints.UserManualTypeEndpoints;

public static class UserManualTypeEndpoints
{
    public static void MapUserManualTypeEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/user-manual-types")
            .RequireAuthorization()
            .WithTags("User Manual Types");

        MapGetEndpoints(group);
        MapCreateEndpoints(group);
        MapUpdateEndpoints(group);
        MapDeleteEndpoints(group);
    }

    private static void MapGetEndpoints(RouteGroupBuilder group)
    {
        group.MapGet("/",
                async (IUserManualTypeService userManualTypeService, CancellationToken cancellationToken) =>
                {
                    return await userManualTypeService.GetAllAsync(cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetAllUserManualTypes")
            .WithSummary("Get all user manual types")
            .WithDescription("Retrieves all user manual types")
            .Produces<IReadOnlyList<UserManualTypeItem>>()
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/{id:int}",
                async (int id, IUserManualTypeService userManualTypeService, CancellationToken cancellationToken) =>
                {
                    return await userManualTypeService.GetByIdAsync(id, cancellationToken).ToGetMinimalApiResultAsync();
                })
            .WithName("GetUserManualTypeById")
            .WithSummary("Get user manual type by ID")
            .WithDescription("Retrieves a specific user manual type by its ID")
            .Produces<UserManualTypeItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapCreateEndpoints(RouteGroupBuilder group)
    {
        group.MapPost("/",
                async (UserManualTypeCreate request, IUserManualTypeService userManualTypeService,
                    IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    request = request with { CreatedByUserId = userContext.GetUserId() };
                    return await userManualTypeService.AddAsync(request, cancellationToken)
                        .ToMinimalApiResultAsync();
                })
            .WithName("CreateUserManualType")
            .WithSummary("Create a new user manual type")
            .WithDescription("Creates a new UserManualType resource. The code must be unique.")
            .Produces<UserManualTypeItem>(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static void MapUpdateEndpoints(RouteGroupBuilder group)
    {
        group.MapPut("/{id:int}",
                async (int id, UserManualTypeUpdate request, IUserManualTypeService userManualTypeService,
                    IUserContext userContext,
                    CancellationToken cancellationToken) =>
                {
                    request = request with { UpdatedByUserId = userContext.GetUserId() };
                    return await userManualTypeService.UpdateAsync(id, request, cancellationToken)
                        .ToMinimalApiResultAsync();
                })
            .WithName("UpdateUserManualType")
            .WithSummary("Update a user manual type")
            .WithDescription("Updates an existing UserManualType resource. The code must be unique.")
            .Produces<UserManualTypeItem>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }

    private static void MapDeleteEndpoints(RouteGroupBuilder group)
    {
        group.MapDelete("/{id:int}",
                async (int id, IUserManualTypeService userManualTypeService, CancellationToken cancellationToken) =>
                {
                    return await userManualTypeService.DeleteAsync(id, cancellationToken).ToMinimalApiResultAsync();
                })
            .WithName("DeleteUserManualType")
            .WithSummary("Delete a user manual type")
            .WithDescription("Deletes a user manual type by its ID")
            .Produces<bool>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }
}
