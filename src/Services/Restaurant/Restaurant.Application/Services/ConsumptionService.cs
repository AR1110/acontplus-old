using Common.Core.Interfaces;
using Common.Core.Utils;
using Restaurant.Core.Interfaces;

namespace Restaurant.Application.Services
{
    public class ConsumptionService : IConsumptionService
    {
        private readonly IADORepository _repository;
        public ConsumptionService(IADORepository repository)
        {
            _repository = repository;
        }
        public async Task<object> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await _repository.GetDataSetAsync("Restaurant.ConsumoTpv_Get", parameters, true);
            if (ds.Tables[0].Rows.Count == 0) { return null; }
            return DataConverters.DataSetToJSON(ds, true);
        }
        public async Task<string> AddAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("Restaurant.ConsumoTpv_Insert", parameters);
        }
        public async Task<string> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("Restaurant.ConsumoTpv_Update", parameters);
        }
        public async Task<string> DeleteAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("Restaurant.ConsumoTpv_Delete", parameters);
        }
        public async Task<string> PrintAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("Restaurant.ConsumoTpv_Print", parameters);
        }
    }
}
