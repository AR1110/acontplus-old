using Configuracion.API.Endpoints.Interfaces;

namespace Configuracion.API.Endpoints.Implementations;

public class PrinterTypeEndpoints(IPrinterTypeService printerTypeService) : IPrinterTypeEndpoints
{
    public async Task<IResult> GetPrinterTypes()
    {
        return Results.Ok(await printerTypeService.GetAsync());
    }
}
