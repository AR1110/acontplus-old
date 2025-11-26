namespace Configuration.Api.Endpoints.PrinterDocumentEndpoints;

public static class CreateEndpoints
{
    public static void MapCreateEndpoints(this IEndpointRouteBuilder endpointRouteBuilder)
    {
        var printerGroup = endpointRouteBuilder.MapGroup($"/api/PrinterDocument")
            .RequireAuthorization()
            
            .WithTags("PrinterDocument");

        printerGroup.MapPost("/",
            async (PrinterDocument printerDocument, IPrinterDocumentRepository printerDocumentRepository,
                IUserContext userContext) =>
            {
                printerDocument.CreatedByUserId = userContext.GetUserId();
                var result = await printerDocumentRepository.AddAsync(printerDocument);
                return Results.Ok(result);
            });
    }
}
