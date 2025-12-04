namespace Configuration.Infrastructure.Persistence.Repositories;

public class PrinterRepository(ConfigurationContext context, IAdoRepository repository) : IPrinterRepository
{
    public async Task<SpResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Config.Printer_Get", parameters);
        return DataValidation.DataSetIsNull(ds, true)
            ? new SpResponse { Code = "0", Message = "Data not found!" }
            : new SpResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
    }

    public async Task<Printer> GetByIdAsync(int id)
    {
        return await context.Printers.AsNoTracking().Include(x => x.Documents).FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<SpResponse> AddAsync(Printer printer)
    {
        await context.AddAsync(printer);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Guardada Exitosamente" };
    }

    public async Task<SpResponse> UpdateAsync(int id, Printer printer)
    {
        if (id != printer.Id) return new SpResponse { Code = "0", Message = "Id Incorrecto" };

        var printerFound = await context.Printers.FindAsync(id);
        if (printerFound == null) return new SpResponse { Code = "0", Message = "Item not found!" };

        printerFound.PrinterTypeId = printer.PrinterTypeId;
        printerFound.Name = printer.Name;
        printerFound.Machine = printer.Machine;
        printerFound.IpAddress = printer.IpAddress;
        printerFound.MacAddress = printer.MacAddress;
        printerFound.ServerDevice = printer.ServerDevice;
        printerFound.IsDefault = printer.IsDefault;
        printerFound.IsActive = printer.IsActive;
        printerFound.Domain = printer.Domain;
        printerFound.UpdatedByUserId = printer.UpdatedByUserId;
        context.Update(printerFound);
        await context.SaveChangesAsync();

        return new SpResponse { Code = "1", Message = "Actualizada exitosamente" };
    }

    public async Task<SpResponse> DeleteAsync(int id, int userId)
    {
        var printerFound = await context.Printers.FindAsync(id);
        if (printerFound == null) return null;

        context.Remove(printerFound);
        await context.SaveChangesAsync();
        return new SpResponse { Code = "1", Message = "Eliminada exitosamente" };
    }
}
