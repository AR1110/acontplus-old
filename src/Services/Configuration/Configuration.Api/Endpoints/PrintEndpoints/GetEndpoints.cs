namespace Configuration.Api.Endpoints.PrintEndpoints;

public static class GetEndpoints
{
    public static void MapGetEndpoints(this IEndpointRouteBuilder endpointRouteBuilder)
    {
        var printerGroup = endpointRouteBuilder.MapGroup($"/api/Print")
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("Print");

        printerGroup.MapGet("/",
            async (string json, IPrintService printService, IUserContext userContext,
                IHttpContextAccessor httpContextAccessor) =>
            {
                var parameters = new Dictionary<string, object>
                {
                    { "userRoleId", userContext.GetClaimValue<int>("userRoleId") },
                    { "json", SqlStringParam.Sanitize(json) },
                    { "isMobileUserAgent", httpContextAccessor.HttpContext!.Items["IsMobileUserAgent"] ?? "false" }
                };
                var result = await printService.GetAsync(parameters);
                return Results.Ok(result);
            });
    }
}
