namespace Configuration.Api.Endpoints.LicenseEndpoints;

public static class UpdateEndpoints
{
    public static void MapUpdateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licenses")
            .RequireAuthorization()
            .WithTags("Licenses");

        group.MapPut("/{id:int}",
                async (int id, LicenseUpdate request, ILicenseService licenseService, IUserContext userContext, CancellationToken cancellationToken) =>
                {
                    var result = await licenseService.UpdateAsync(id, request, userContext.GetUserId(), cancellationToken);
                    return result.ToMinimalApiResult();
                })
            .WithName("UpdateLicense")
            .WithSummary("Update License")
            .WithDescription("Updates an existing License")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
