namespace Configuracion.API.Services.Printing;

public class PrinterService(ConfigContext context, IAdoRepository repository) : IPrinterService
{
    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await repository.GetDataSetAsync("Config.Printer_Get", parameters);
        if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0) { return null; }

        return DataConverters.DataSetToJson(ds);
    }

    public async Task<Printer> GetByIdAsync(int id)
    {
        return await context.Printers.Include(x => x.Documents).FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<object> AddAsync(Printer printer)
    {
        await context.AddAsync(printer);
        await context.SaveChangesAsync();
        return new { code = "1", message = "Guardada Exitosamente" };
    }

    public async Task<object> UpdateAsync(int id, Printer printer)
    {
        if (id != printer.Id)
        {
            return new { code = "0", message = "Id Incorrecto" };
        }

        var printerFound = await context.Printers.FindAsync(id);
        if (printerFound == null)
        {
            return null;
        }

        printerFound.PrinterTypeId = printer.PrinterTypeId;
        printerFound.Name = printer.Name;
        printerFound.Machine = printer.Machine;
        printerFound.IpAddress = printer.IpAddress;
        printerFound.MacAddress = printer.MacAddress;
        printerFound.ServerDevice = printer.ServerDevice;
        printerFound.IsDefault = printer.IsDefault;
        printerFound.Enabled = printer.Enabled;
        printerFound.UserId = printer.UserId;
        printerFound.Domain = printer.Domain;
        context.Update(printerFound);
        await context.SaveChangesAsync();

        return new { code = "1", message = "Actualizada exitosamente" };
    }

    public async Task<object> DeleteAsync(int id, int userId)
    {
        var printerFound = await context.Printers.FindAsync(id);
        if (printerFound == null)
        {
            return null;
        }

        printerFound.Enabled = false;
        printerFound.Deleted = true;
        printerFound.UserId = userId;
        context.Update(printerFound);
        await context.SaveChangesAsync();
        return new { code = "1", message = "Eliminada exitosamente" };
    }
}
