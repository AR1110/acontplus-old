namespace Configuration.Api.Endpoints.LicenseDetailEndpoints;

public static class UpdateEndpoints
{
    public static void MapUpdateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licensedetails")
            .RequireAuthorization()
            .WithTags("LicenseDetails");

        group.MapPut("/{id:int}",
                async (int id, LicenseDetailUpdate request, ILicenseDetailService licenseDetailService, IUserContext userContext) =>
                {
                    var entity = request.Adapt<LicenseDetails>();
                    entity.UpdatedByUserId = userContext.GetUserId();

                    var result = await licenseDetailService.UpdateAsync(id, entity);
                    return result.ToMinimalApiResult();
                })
            .WithName("UpdateLicenseDetail")
            .WithSummary("Update License Detail")
            .WithDescription("Updates an existing License Detail")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
