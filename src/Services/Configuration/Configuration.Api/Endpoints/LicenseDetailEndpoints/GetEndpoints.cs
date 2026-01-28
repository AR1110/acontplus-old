namespace Configuration.Api.Endpoints.LicenseDetailEndpoints;

public static class GetEndpoints
{
    public static void MapGetEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/licensedetails")
            .RequireAuthorization()
            .WithTags("LicenseDetails");

        group.MapGet("/",
                async (string json, ILicenseDetailService licenseDetailService) =>
                {
                    var parameters = new Dictionary<string, object>
                    {
                        { "json", SqlStringParam.Sanitize(json) }
                    };
                    var result = await licenseDetailService.GetAsync(parameters);
                    return result.ToGetMinimalApiResult();
                })
            .WithName("GetLicenseDetails")
            .WithSummary("Get License Details")
            .WithDescription("Retrieves license details based on json parameter")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status500InternalServerError);
    }
}
