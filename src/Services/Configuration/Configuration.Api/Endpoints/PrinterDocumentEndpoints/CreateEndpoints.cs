namespace Configuration.Api.Endpoints.PrinterDocumentEndpoints;

public static class CreateEndpoints
{
    public static void MapCreateEndpoints(this IEndpointRouteBuilder endpointRouteBuilder)
    {
        var printerGroup = endpointRouteBuilder.MapGroup($"/api/PrinterDocument")
            .RequireAuthorization()
            .WithTags("PrinterDocument");

        printerGroup.MapPost("/",
            async (PrinterDocumentCreate printerDocumentDto, IPrinterDocumentRepository printerDocumentRepository,
                IUserContext userContext) =>
            {
                var printerDocument = new PrinterDocument
                {
                    Id = 0,
                    PrinterId = printerDocumentDto.PrinterId,
                    CodDoc = printerDocumentDto.CodDoc,
                    Copies = printerDocumentDto.Copies,
                    CreatedByUserId = userContext.GetUserId(),
                    Printer = null!
                };

                var result = await printerDocumentRepository.AddAsync(printerDocument);
                return Results.Ok(result);
            });
    }
}
