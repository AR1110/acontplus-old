namespace Configuration.Api.Endpoints.PrinterEndpoints;

public static class CreateEndpoints
{
    public static void MapCreateEndpoints(this IEndpointRouteBuilder endpointRouteBuilder)
    {
        var printerGroup = endpointRouteBuilder.MapGroup($"/api/Printer")
            .RequireAuthorization()
            .WithTags("Printer");

        printerGroup.MapPost("/",
                async (PrinterCreate printerDto, IPrinterRepository printerRepository, IUserContext userContext) =>
                {
                    var printer = printerDto.Adapt<Printer>();
                    printer.CreatedByUserId = userContext.GetUserId();

                    var result = await printerRepository.AddAsync(printer);
                    return Results.Ok(result);
                });
    }
}
