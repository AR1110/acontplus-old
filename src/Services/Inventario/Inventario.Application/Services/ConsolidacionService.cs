using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Common.Core.Interfaces;
using Common.Core.Utils;
using Inventario.Core.Interfaces;

namespace Inventario.Application.Services
{
    public class ConsolidacionService: IConsolidacionService
    {
        private readonly IADORepository _repository;
        private readonly string nameSchema = "Inventario.Consolidacion";
        public ConsolidacionService(IADORepository repository)
        {
            _repository = repository;
        }
        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync(nameSchema +"_Get", parameters);
            if (ds.Tables.Count == 0)
            {
                return null;
            }
            else
            {
                return DataConverters.DataSetToJSON(ds);
            }
        }

        public async Task<object> GetIdAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync(nameSchema + "_Get_Id", parameters);
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
            return await _repository.SPExecuteDeprecatedAsync(nameSchema + "_Insert", parameters);
        }

         public async Task<string> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteDeprecatedAsync(nameSchema + "_Update", parameters);
        }

         public async Task<string> DeleteAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteDeprecatedAsync(nameSchema + "_Delete", parameters);
        }
    }
}
