namespace Configuration.Api.Endpoints.LicenseDetailEndpoints;

public static class DeleteEndpoints
{
    public static void MapDeleteEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licensedetails")
            .RequireAuthorization()
            .WithTags("LicenseDetails");

        group.MapDelete("/{id:int}",
                async (int id, ILicenseDetailService licenseDetailService, IUserContext userContext) =>
                {
                    var result = await licenseDetailService.DeleteAsync(id, userContext.GetUserId());
                    return result.ToMinimalApiResult();
                })
            .WithName("DeleteLicenseDetail")
            .WithSummary("Delete License Detail")
            .WithDescription("Soft deletes a License Detail resource")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
