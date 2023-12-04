using Common.Core.Interfaces;
using Common.Core.Utils;
using Configuracion.API.Interfaces;

namespace Configuracion.API.Services
{
    public class PrintService : IPrintService
    {
        private readonly IADORepository _repository;
        public PrintService(IADORepository repository)
        {
            _repository = repository;
        }
        public async Task<string> GetAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("Config.Print_Get", parameters); 
        }
    }
}
