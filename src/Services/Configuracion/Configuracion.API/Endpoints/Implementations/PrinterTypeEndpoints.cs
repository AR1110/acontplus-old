namespace Configuracion.API.Endpoints.Implementations;

public class PrinterTypeEndpoints(IPrinterTypeRepository printerTypeService) : IPrinterTypeEndpoints
{
    public async Task<IResult> GetPrinterTypes()
    {
        return Results.Ok(await printerTypeService.GetAsync());
    }
}