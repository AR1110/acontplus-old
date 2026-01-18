namespace Identity.Api.Endpoints.LicenseAccessEndpoints;

public static class CreateEndpoints
{
    public static void MapCreateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licenseaccess")
            .RequireAuthorization()
            .WithTags("LicenseAccess");

        group.MapPost("/",
                async (LicenseAccessCreate request, ILicenseAccessService licenseAccessService, IUserContext userContext) =>
                {
                    var result = await licenseAccessService.AddAsync(request, userContext.GetUserId());
                    return result.ToMinimalApiResult();
                })
            .WithName("CreateLicenseAccess")
            .WithSummary("Create License Access")
            .WithDescription("Creates a new License Access")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
