namespace Configuration.Api.Endpoints.LicenseDetailEndpoints;

public static class CreateEndpoints
{
    public static void MapCreateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licensedetails")
            .RequireAuthorization()
            .WithTags("LicenseDetails");

        group.MapPost("/",
                async (LicenseDetailCreate request, ILicenseDetailService licenseDetailService, IUserContext userContext) =>
                {
                    var entity = request.Adapt<LicenseDetails>();
                    entity.CreatedByUserId = userContext.GetUserId();
                    entity.IsActive = true;
                    // Note: Entity ID maps from request or 0.

                    var result = await licenseDetailService.AddAsync(entity);
                    return result.ToMinimalApiResult();
                })
            .WithName("CreateLicenseDetail")
            .WithSummary("Create License Detail")
            .WithDescription("Creates a new License Detail")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
