using Common.Core.Interfaces;
using Common.Core.Utils;
using Configuracion.API.Data;
using Configuracion.API.Entities;
using Configuracion.API.Interfaces;

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
        public Task<object> AddAsync(Printer printer)
        {
            return null;
        }
        public Task<object> UpdateAsync(int id, Printer printer)
        {
            return null;
        }
        public Task<object> DeleteAsync(int id, int userId)
        {
            return null;
        }
    }
}
