namespace Configuracion.Application.Services.Printing;

public class PrinterTypeService(ConfigContext context) : IPrinterTypeService
{
    public async Task<ApiResponse> GetAsync()
    {
        var printerTypes = await context.PrinterTypes.ToListAsync();
        return printerTypes.Count == 0
            ? new ApiResponse { Code = "0", Message = "No Printer Types Available" }
            : new ApiResponse { Code = "1", Payload = printerTypes };
    }
}