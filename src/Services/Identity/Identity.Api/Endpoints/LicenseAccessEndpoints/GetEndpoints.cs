namespace Identity.Api.Endpoints.LicenseAccessEndpoints;

public static class GetEndpoints
{
    public static void MapGetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licenseaccess")
            .RequireAuthorization()
            .WithTags("LicenseAccess");

        group.MapGet("/",
                async (string json, ILicenseAccessService licenseAccessService) =>
                {
                    var parameters = new Dictionary<string, object>
                    {
                        { "userRoleId", 0 },
                        { "json", SqlStringParam.Sanitize(json) } // Ensure SqlStringParam is available via namespace or rename if needed. Assuming it is generic.
                    };
                    var result = await licenseAccessService.GetAsync(parameters);
                    return result.ToGetMinimalApiResult();
                })
            .WithName("GetLicenseAccess")
            .WithSummary("Get License Access")
            .WithDescription("Retrieves license access based on json parameter")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
