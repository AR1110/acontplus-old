namespace Configuration.Infrastructure.Persistence.Repositories;

public class PrinterTypeRepository(ConfigurationContext context) : IPrinterTypeRepository
{
  public async Task<SpResponse> GetAsync()
  {
    var printerTypes = await context.PrinterTypes.AsNoTracking().ToListAsync();
    return printerTypes.Count == 0
        ? new SpResponse { Code = "0", Message = "No Printer Types Available" }
        : new SpResponse { Code = "1", Payload = printerTypes };
  }
}
