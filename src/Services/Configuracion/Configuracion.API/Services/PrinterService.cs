using Common.Core.Interfaces;
using Common.Core.Utils;
using Configuracion.API.Data;
using Configuracion.API.Entities;
using Configuracion.API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Configuracion.API.Services
{
    public class PrinterService : IPrinterService
    {
        private readonly ConfigContext _context;
        private readonly IADORepository _repository;
        public PrinterService(ConfigContext context, IADORepository repository)
        {
            _context = context;
            _repository = repository;
        }
        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Config.Printer_Get", parameters);
            if (ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0) { return null; }
            return DataConverters.DataSetToJSON(ds);
        }
        public async Task<Printer> GetByIdAsync(int id)
        {
            return await _context.Printers.Include(x => x.Documents).FirstOrDefaultAsync(x => x.Id == id);
        }
        public async Task<object> AddAsync(Printer printer)
        {
            await _context.AddAsync(printer);
            await _context.SaveChangesAsync();
            return new { code = "1", message = "Guardada Exitosamente" };
        }
        public async Task<object> UpdateAsync(int id, Printer printer)
        {
            if (id != printer.Id)
            {
                return new { code = "0", message = "Id Incorrecto" };
            }
            var printerFound = await _context.Printers.FindAsync(id);
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
            _context.Update(printerFound);
            await _context.SaveChangesAsync();

            return new { code = "1", message = "Actualizada exitosamente" };
        }
        public async Task<object> DeleteAsync(int id, int userId)
        {
            var printerFound = await _context.Printers.FindAsync(id);
            if (printerFound == null)
            {
                return null;
            }

            printerFound.Enabled = false;
            printerFound.Deleted = true;
            printerFound.UserId = userId;
            _context.Update(printerFound);
            await _context.SaveChangesAsync();
            return new { code = "1", message = "Eliminada exitosamente" };
        }
    }
}
