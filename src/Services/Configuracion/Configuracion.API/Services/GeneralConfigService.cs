using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using Configuracion.API.Data;
using Configuracion.API.Interfaces;

namespace Configuracion.API.Services
{
    public class GeneralConfigService: IGeneralConfigService
    {
        private readonly IADORepository _repository; 
        private readonly string nameSchema = "Config.Sistema";

        public GeneralConfigService(IADORepository repository)
        {
            _repository = repository;
        }

        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync(nameSchema + "_Get", parameters);
            if (ds.Tables.Count == 0)
            {
                return null;
            }
            else
            {
                return DataConverters.DataSetToJSON(ds);
            }
        }
         

        public async Task<string> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteDeprecatedAsync(nameSchema + "_Update", parameters);
        } 
    }
}
