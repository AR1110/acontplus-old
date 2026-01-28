namespace Common.Api.Endpoints.ReleaseEndpoints;

public static class ReleaseEndpoints
{
    public static void MapReleaseEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/releases")
            .RequireAuthorization()
            .WithTags("Releases");

        MapGetEndpoints(group);
    }

    private static void MapGetEndpoints(RouteGroupBuilder group)
    {
        group.MapGet("/{userRoleId:int}",
                async (int userRoleId, IReleaseService releaseService, CancellationToken cancellationToken) =>
                {
                    var resp = await releaseService.GetAsync(userRoleId);
                    return Results.Ok(resp);
                })
            .WithName("GetReleases")
            .WithSummary("Get releases")
            .WithDescription("Retrieves releases for a user role")
            .Produces<SpResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
