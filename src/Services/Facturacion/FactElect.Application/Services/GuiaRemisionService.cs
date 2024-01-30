using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Common.Core.Interfaces;
using Common.Core.Utils;
using FactElect.Core.Interfaces;

namespace FactElect.Application.Services
{
    public class GuiaRemisionService : IGuiaRemisionService
    {
        private readonly IADORepository _repository;
        public GuiaRemisionService(IADORepository repository)
        {
            _repository = repository;
        }
        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Logistica.GuiaRemision_Get", parameters);
            if (ds.Tables.Count == 0)
            {
                return null;
            }
            else
            {
                return DataConverters.DataSetToJSON(ds);
            }
        }
        public async Task<object> GetByIdAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Logistica.GuiaRemision_Get_Id", parameters);
            if (ds.Tables[0].Rows.Count == 0) { return null; }
            return DataConverters.DataSetToJSON(ds);
        }
        public async Task<string> AddAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("Logistica.GuiaRemision_Insert", parameters);
        }
        public async Task<string> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("Logistica.GuiaRemision_Update", parameters);
        }
        public async Task<string> DeleteAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("Logistica.GuiaRemision_Delete", parameters);
        }
    }
}
