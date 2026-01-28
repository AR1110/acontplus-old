namespace Configuration.Api.Endpoints.LicenseEndpoints;

public static class CreateEndpoints
{
    public static void MapCreateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licenses")
            .RequireAuthorization()
            .WithTags("Licenses");

        group.MapPost("/",
                async (LicenseCreate request, ILicenseService licenseService, IUserContext userContext, CancellationToken cancellationToken) =>
                {
                    var result = await licenseService.AddAsync(request, userContext.GetUserId(), cancellationToken);
                    return result.ToMinimalApiResult();
                })
            .WithName("CreateLicense")
            .WithSummary("Create License")
            .WithDescription("Creates a new License")
            .Produces(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
