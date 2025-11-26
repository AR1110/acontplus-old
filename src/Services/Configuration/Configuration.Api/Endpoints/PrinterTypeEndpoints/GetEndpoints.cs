namespace Configuration.Api.Endpoints.PrinterTypeEndpoints;

public static class GetEndpoints
{
    public static void MapGetEndpoints(this IEndpointRouteBuilder endpointRouteBuilder)
    {
        var printerGroup = endpointRouteBuilder.MapGroup($"/api/PrinterType")
            .RequireAuthorization()
            
            .WithTags("PrinterType");

        printerGroup.MapGet("/", async (IPrinterTypeRepository printerTypeRepository) =>
        {
            var result = await printerTypeRepository.GetAsync();
            return Results.Ok(result);
        });
    }
}
