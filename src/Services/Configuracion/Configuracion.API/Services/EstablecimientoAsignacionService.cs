using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using Configuracion.API.Interfaces;

namespace Configuracion.API.Services
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

        public async Task<object> GetDataFormAsync(Dictionary<string, object> parameters)
        {

            var ds = await _repository.GetDataSetAsync("Config.Estab_Asig_Get_Data_Form", parameters);
            if (ds.Tables[0].Rows.Count == 0) { return null; }
            return DataConverters.DataSetToJSON(ds, true);
        }

        public async Task<string> AddAsync(ApiRequest request)
        {
            var parameters = new Dictionary<string, object>{
                {"userRoleId", request.UserRoleId},
                {"json", DataConverters.SerializeDictionary(request.Data)}
            };
            return await _repository.SPExecuteAsync("Config.Estab_Asig_Insert", parameters);
        }

        public async Task<string> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("Config.Estab_Asig_Update", parameters);
        }
    }
}
