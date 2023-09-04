using Lib.Common;
using Common.Infrastructure.Repository;
using ApiConfig.Interfaces;

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

            var dt = await _repository.GetDataTableAsync("ConfigContext", "Config.Estab_Asig_Get", parameters);
            if (!DataValidation.DataTableIsNull(dt))
            {
                return Converters.DataTableToJSON(dt);
            }
            else
            {
                return null;
            }
        }
    }
}
