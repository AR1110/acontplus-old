namespace Configuracion.API.Endpoints.Implementations;

public class PrinterEndpoints(IPrinterRepository printerService, IUserContext userContext) : IPrinterEndpoints
{
    private const string UserRoleClaimType = "userRoleId";

    public async Task<IResult> GetPrinters(string json)
    {
        var parameters = new Dictionary<string, object>
        {
            { "userRoleId", userContext.GetClaimValue<int>(UserRoleClaimType) },
            { "json", SqlStringParam.Sanitize(json) }
        };
        var result = await printerService.GetAsync(parameters);
        return Results.Ok(result);
    }

    public async Task<IResult> GetPrinterById(int id)
    {
        var result = await printerService.GetByIdAsync(id);
        return Results.Ok(result);
    }

    public async Task<IResult> CreatePrinter(Printer printer)
    {
        printer.CreatedByUserId = userContext.GetUserId();
        printer.CreatedByUserId = userContext.GetUserId();
        var result = await printerService.AddAsync(printer);
        return Results.Ok(result);
    }

    public async Task<IResult> UpdatePrinter(int id, Printer printer)
    {
        printer.UpdatedByUserId = userContext.GetUserId();
        var result = await printerService.UpdateAsync(id, printer);
        return Results.Ok(result);
    }

    public async Task<IResult> DeletePrinter(int id)
    {
        var result = await printerService.DeleteAsync(id, userContext.GetUserId());
        return Results.Ok(result);
    }
}
