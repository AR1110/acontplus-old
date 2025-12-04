namespace Configuration.Api.Endpoints.PrinterEndpoints;

public static class CreateEndpoints
{
    public static void MapCreateEndpoints(this IEndpointRouteBuilder endpointRouteBuilder)
    {
        var printerGroup = endpointRouteBuilder.MapGroup($"/api/Printer")
            .RequireAuthorization()

            .WithTags("Printer");

        printerGroup.MapPost("/",
                async (Printer printer, IPrinterRepository printerRepository, IUserContext userContext) =>
                {
                    printer.CreatedByUserId = userContext.GetUserId();
                    var result = await printerRepository.AddAsync(printer);
                    return Results.Ok(result);
                });
    }
}
