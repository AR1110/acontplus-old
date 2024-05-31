using Common.Core.Interfaces;
using Common.Core.Utils;
using Restaurant.API.Interfaces;

namespace Restaurant.API.Services
{
    public class ConsumptionService : IConsumptionService
    {
        private readonly IAdoRepository _repository;
        public ConsumptionService(IAdoRepository repository)
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
            return await _repository.SpExecuteDeprecatedAsync("Restaurant.ConsumoTpv_Insert", parameters);
        }
        public async Task<string> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SpExecuteDeprecatedAsync("Restaurant.ConsumoTpv_Update", parameters);
        }
        public async Task<string> DeleteAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SpExecuteDeprecatedAsync("Restaurant.ConsumoTpv_Delete", parameters);
        }
        public async Task<string> PrintAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SpExecuteDeprecatedAsync("Restaurant.ConsumoTpv_Print", parameters);
        }
    }
}
