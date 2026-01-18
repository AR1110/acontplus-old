namespace Common.Api.Endpoints.BugsEndpoints;

public static class GetEndpoints
{
    public static void MapGetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/bugs")
            .RequireAuthorization()
            .WithTags("Bugs");

        group.MapGet("/",
                async ([FromQuery] string json, IBugsService bugsService, CancellationToken cancellationToken) =>
                {
                    var parameters = new Dictionary<string, object>
                    {
                        { "json", SqlStringParam.Sanitize(json) }
                    };

                    return await bugsService.GetAsync(parameters).ToGetMinimalApiResultAsync();
                })
            .WithName("GetBugs")
            .WithSummary("Get bugs")
            .WithDescription("Retrieves bugs based on json parameter")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
