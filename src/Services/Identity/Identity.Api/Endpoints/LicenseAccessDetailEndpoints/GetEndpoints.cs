namespace Identity.Api.Endpoints.LicenseAccessDetailEndpoints;

public static class GetEndpoints
{
    public static void MapGetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licenseaccessdetail")
            .RequireAuthorization()
            .WithTags("LicenseAccessDetail");

        group.MapGet("/",
                async (string json, ILicenseAccessDetailService licenseAccessDetailService) =>
                {
                    var parameters = new Dictionary<string, object>
                    {
                        { "userRoleId", 0 },
                        { "json", SqlStringParam.Sanitize(json) }
                    };
                    var result = await licenseAccessDetailService.GetAsync(parameters);
                    return result.ToGetMinimalApiResult();
                })
            .WithName("GetLicenseAccessDetail")
            .WithSummary("Get License Access Detail")
            .WithDescription("Retrieves license access detail based on json parameter")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
