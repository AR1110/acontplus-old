namespace Common.Api.Endpoints.UserManualEndpoints;

public static class UserManualEndpoints
{
    public static void MapUserManualEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/user-manuals")
            .RequireAuthorization()
            .WithTags("User Manuals");

        MapGetEndpoints(group);
    }

    private static void MapGetEndpoints(RouteGroupBuilder group)
    {
        group.MapGet("/",
                async (IUserManualService userManualService, [AsParameters] UserManualSearchRequest request,
                    CancellationToken cancellationToken) =>
                {
                    var parameters = new Dictionary<string, object>();
                    if (request.Id.HasValue)
                        parameters.Add("id", request.Id.Value);
                    if (request.UserManualTypeId.HasValue)
                        parameters.Add("userManualTypeId", request.UserManualTypeId.Value);
                    if (request.MenuId.HasValue)
                        parameters.Add("menuId", request.MenuId.Value);
                    if (!string.IsNullOrEmpty(request.SearchTerm))
                        parameters.Add("searchTerm", request.SearchTerm);

                    var resp = await userManualService.GetAsync(parameters);
                    return Results.Ok(resp);
                })
            .WithName("GetUserManuals")
            .WithSummary("Get user manuals")
            .WithDescription("Retrieves user manuals with optional filtering. " +
                           "Use query parameters: id, userManualTypeId, menuId, searchTerm")
            .Produces<SpResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound);
    }
}

public record UserManualSearchRequest(
    int? Id = null,
    int? UserManualTypeId = null,
    int? MenuId = null,
    string? SearchTerm = null
);
