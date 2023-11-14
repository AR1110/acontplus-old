using Common.Core.Interfaces;
using Common.Core.Utils;
using Restaurant.Core.Interfaces;

namespace Restaurant.Application.Services
{
    public class ConsumptionCancelledService : IConsumptionCancelledService
    {
        private readonly IADORepository _repository;
        public ConsumptionCancelledService(IADORepository repository)
        {
            _repository = repository;
        }
        public async Task<string> GetAsync(Dictionary<string, object> parameters)
        {
            var dt = await _repository.GetDataTableAsync("Restaurant.ConsumoAnuladoTpv_Get", parameters);
            if (dt.Rows.Count == 0) { return null; }
            return DataConverters.DataTableToJSON(dt);
        }
        public async Task<string> AddAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("Restaurant.ConsumoAnuladoTpv_Insert", parameters);
        }
        public async Task<string> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("Restaurant.ConsumoAnuladoTpv_Update", parameters);
        }
        public async Task<string> DeleteAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SPExecuteAsync("Restaurant.ConsumoAnuladoTpv_Delete", parameters);
        }
    }
}
