namespace Identity.Api.Endpoints.LicenseAccessDetailEndpoints;

public static class DeleteEndpoints
{
    public static void MapDeleteEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licenseaccessdetail")
            .RequireAuthorization()
            .WithTags("LicenseAccessDetail");

        group.MapDelete("/{id}",
                async (int id, ILicenseAccessDetailService licenseAccessDetailService) =>
                {
                    var result = await licenseAccessDetailService.DeleteAsync(id);
                    return result.ToMinimalApiResult();
                })
            .WithName("DeleteLicenseAccessDetail")
            .WithSummary("Delete License Access Detail")
            .WithDescription("Deletes a License Access Detail by id")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
