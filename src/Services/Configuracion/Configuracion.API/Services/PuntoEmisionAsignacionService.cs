using Common.Core.Interfaces;
using Common.Core.Utils;
using Configuracion.API.Interfaces;

namespace Configuracion.API.Services
{
    public class PuntoEmisionAsignacionService : IPuntoEmisionAsignacionService
    {
        private readonly IADORepository _repository;

        public PuntoEmisionAsignacionService(IADORepository repository)
        {
            _repository = repository;
        }

        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Config.PtoEmi_Asig_Get", parameters);
            if (ds.Tables.Count == 0)
            {
                return null;
            }
            else
            {
                return DataConverters.DataSetToJSON(ds);
            }
        }


        public async Task<string> AddAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteDeprecatedAsync("Config.PtoEmi_Asig_Insert", parameters);
        }

        public async Task<string> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteDeprecatedAsync("Config.PtoEmi_Asig_Update", parameters);
        }

        public async Task<string> DeleteAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteDeprecatedAsync("Contabilidad.Caja_Delete", parameters);
        }
    }
}
