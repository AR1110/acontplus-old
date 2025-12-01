namespace Configuration.Api.Endpoints.PrinterEndpoints;

public static class DeleteEndpoints
{
    private const string UserRoleClaimType = "UserRoleId";

    public static void MapDeleteEndpoints(this IEndpointRouteBuilder endpointRouteBuilder)
    {
        var printerGroup = endpointRouteBuilder.MapGroup($"/api/Printer")
            .RequireAuthorization()
            
            .WithTags("Printer");

        printerGroup.MapDelete("/{id:int}",
            async (int id, IPrinterRepository printerRepository, IUserContext userContext) =>
            {
                var result = await printerRepository.DeleteAsync(id, userContext.GetUserId());
                return Results.Ok(result);
            });
    }
}
