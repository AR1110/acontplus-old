namespace Configuration.Api.Endpoints.PrinterEndpoints;

public static class UpdateEndpoints
{
    private const string UserRoleClaimType = "UserRoleId";

    public static void MapUpdateEndpoints(this IEndpointRouteBuilder endpointRouteBuilder)
    {
        var printerGroup = endpointRouteBuilder.MapGroup($"/api/Printer")
            .RequireAuthorization()
            .WithOpenApi()
            .WithTags("Printer");

        printerGroup.MapPut("/{id:int}",
            async (int id, Printer printer, IPrinterRepository printerRepository, IUserContext userContext) =>
            {
                printer.UpdatedByUserId = userContext.GetUserId();
                var result = await printerRepository.UpdateAsync(id, printer);
                return Results.Ok(result);
            });
    }
}
