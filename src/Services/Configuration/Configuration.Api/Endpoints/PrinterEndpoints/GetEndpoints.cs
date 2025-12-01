namespace Configuration.Api.Endpoints.PrinterEndpoints;

public static class GetEndpoints
{
    private const string UserRoleClaimType = "UserRoleId";

    public static void MapGetEndpoints(this IEndpointRouteBuilder endpointRouteBuilder)
    {
        var printerGroup = endpointRouteBuilder.MapGroup($"/api/Printer")
            .RequireAuthorization()
            
            .WithTags("Printer");

        printerGroup.MapGet("/", async (string json, IPrinterRepository printerRepository, IUserContext userContext) =>
        {
            var parameters = new Dictionary<string, object>
            {
                { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
                { "json", SqlStringParam.Sanitize(json) }
            };
            var result = await printerRepository.GetAsync(parameters);
            return Results.Ok(result);
        });

        printerGroup.MapGet("/{id:int}",
            async (int id, IPrinterRepository printerRepository, IUserContext userContext) =>
            {
                var result = await printerRepository.GetByIdAsync(id);
                return Results.Ok(result);
            });
    }
}
