namespace Configuration.Api.Endpoints.PrinterEndpoints;

public static class UpdateEndpoints
{
    private const string UserRoleClaimType = "UserRoleId";

    public static void MapUpdateEndpoints(this IEndpointRouteBuilder endpointRouteBuilder)
    {
        var printerGroup = endpointRouteBuilder.MapGroup($"/api/Printer")
            .RequireAuthorization()
            .WithTags("Printer");

        printerGroup.MapPut("/{id:int}",
            async (int id, PrinterUpdate printerDto, IPrinterRepository printerRepository, IUserContext userContext) =>
            {
                var printer = printerDto.Adapt<Printer>();
                printer.UpdatedByUserId = userContext.GetUserId();

                var result = await printerRepository.UpdateAsync(id, printer);
                return Results.Ok(result);
            });
    }
}
