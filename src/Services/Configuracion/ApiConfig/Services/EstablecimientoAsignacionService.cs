using ApiConfig.Interfaces;
using Common.Core.Interfaces;
using Common.Core.Utils;

namespace ApiConfig.Services
{
    public class EstablecimientoAsignacionService : IEstablecimientoAsignacionService
    {
        private IADORepository _repository;
        public EstablecimientoAsignacionService(IADORepository repository)
        {
            _repository = repository;
        }
        public async Task<string> GetAsync(Dictionary<string, object> parameters)
        {

            var dt = await _repository.GetDataTableAsync("Config.Estab_Asig_Get", parameters);
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
