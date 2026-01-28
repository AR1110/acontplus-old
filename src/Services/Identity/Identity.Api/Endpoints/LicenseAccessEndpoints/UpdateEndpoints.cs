namespace Identity.Api.Endpoints.LicenseAccessEndpoints;

public static class UpdateEndpoints
{
    public static void MapUpdateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licenseaccess")
            .RequireAuthorization()
            .WithTags("LicenseAccess");

        group.MapPut("/{id}",
                async (int id, LicenseAccessUpdate request, ILicenseAccessService licenseAccessService, IUserContext userContext) =>
                {
                    var result = await licenseAccessService.UpdateAsync(id, request, userContext.GetUserId());
                    return result.ToMinimalApiResult();
                })
            .WithName("UpdateLicenseAccess")
            .WithSummary("Update License Access")
            .WithDescription("Updates an existing License Access by id")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
