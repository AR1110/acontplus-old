namespace Identity.Api.Endpoints.LicenseAccessDetailEndpoints;

public static class UpdateEndpoints
{
    public static void MapUpdateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licenseaccessdetail")
            .RequireAuthorization()
            .WithTags("LicenseAccessDetail");

        group.MapPut("/{id}",
                async (int id, LicenseAccessDetailUpdate request, ILicenseAccessDetailService licenseAccessDetailService) =>
                {
                    var result = await licenseAccessDetailService.UpdateAsync(id, request);
                    return result.ToMinimalApiResult();
                })
            .WithName("UpdateLicenseAccessDetail")
            .WithSummary("Update License Access Detail")
            .WithDescription("Updates an existing License Access Detail by id")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
