using Azure.Core;
using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using Configuracion.API.Interfaces;

namespace Configuracion.API.Services
{
    public class TurnoService:ITurnoService
    {
        private IADORepository _repository; 
        public TurnoService(IADORepository respository)
        {
            _repository = respository;
        }

        public async Task<string> GetAsync(Dictionary<string, object> parameters)
        {
            var dt = await _repository.GetDataTableAsync("Config.Turno_Get", parameters);
            if (!DataValidation.DataTableIsNull(dt))
            {
                return DataConverters.DataTableToJSON(dt);
            }
            else
            {
                return null;
            }
        }
        
    }
}
