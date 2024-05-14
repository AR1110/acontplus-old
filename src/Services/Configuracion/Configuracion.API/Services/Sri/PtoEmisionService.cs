using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Common.Core.Interfaces;
using Common.Core.Models;
using Common.Core.Utils;
using Configuracion.API.Interfaces.Sri;

namespace Configuracion.API.Services.Sri
{
    public class PtoEmisionService:IPtoEmisionService
    {
        private readonly IADORepository _repository;
        private readonly string nameSchema = "Sri.PtoEmision_";

        public PtoEmisionService(IADORepository repository)
        {
            _repository = repository;
        }

        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync(nameSchema + "Get", parameters);
            if (ds.Tables.Count == 0)
            {
                return null;
            }
            else
            {
                return DataConverters.DataSetToJSON(ds);
            }
        }

        public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync(nameSchema + "Insert", parameters);
        }

        public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync(nameSchema + "Update", parameters);
        }

        public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync(nameSchema + "Delete", parameters);
        }
    }
}
