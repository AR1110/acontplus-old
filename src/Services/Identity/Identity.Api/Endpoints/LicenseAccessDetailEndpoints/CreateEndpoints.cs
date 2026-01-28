namespace Identity.Api.Endpoints.LicenseAccessDetailEndpoints;

public static class CreateEndpoints
{
    public static void MapCreateEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licenseaccessdetail")
            .RequireAuthorization()
            .WithTags("LicenseAccessDetail");

        group.MapPost("/",
                async (LicenseAccessDetailCreate request, ILicenseAccessDetailService licenseAccessDetailService) =>
                {
                    var result = await licenseAccessDetailService.AddAsync(request);
                    return result.ToMinimalApiResult();
                })
            .WithName("CreateLicenseAccessDetail")
            .WithSummary("Create License Access Detail")
            .WithDescription("Creates a new License Access Detail")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
