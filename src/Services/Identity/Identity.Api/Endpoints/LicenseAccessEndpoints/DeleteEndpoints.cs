namespace Identity.Api.Endpoints.LicenseAccessEndpoints;

public static class DeleteEndpoints
{
    public static void MapDeleteEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licenseaccess")
            .RequireAuthorization()
            .WithTags("LicenseAccess");

        group.MapDelete("/{id}",
                async (int id, ILicenseAccessService licenseAccessService) =>
                {
                    var result = await licenseAccessService.DeleteAsync(id);
                    return result.ToMinimalApiResult();
                })
            .WithName("DeleteLicenseAccess")
            .WithSummary("Delete License Access")
            .WithDescription("Deletes a License Access by id")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
