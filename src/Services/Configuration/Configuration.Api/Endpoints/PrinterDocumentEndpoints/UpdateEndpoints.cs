namespace Configuration.Api.Endpoints.PrinterDocumentEndpoints;

public static class UpdateEndpoints
{
    public static void MapUpdateEndpoints(this IEndpointRouteBuilder endpointRouteBuilder)
    {
        var printerGroup = endpointRouteBuilder.MapGroup($"/api/PrinterDocument")
            .RequireAuthorization()
            .WithTags("PrinterDocument");

        printerGroup.MapPut("/{id:int}",
            async (int id, PrinterDocumentUpdate printerDocumentDto, IPrinterDocumentRepository printerDocumentRepository,
                IUserContext userContext) =>
            {
                var printerDocument = printerDocumentDto.Adapt<PrinterDocument>();
                printerDocument.UpdatedByUserId = userContext.GetUserId();

                var result = await printerDocumentRepository.UpdateAsync(id, printerDocument);
                return Results.Ok(result);
            });
    }
}
