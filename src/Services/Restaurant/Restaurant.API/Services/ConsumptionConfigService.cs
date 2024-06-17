using Common.Core.Interfaces;
using Common.Core.Utils;
using Restaurant.API.Interfaces;

namespace Restaurant.API.Services
{
    public class ConsumptionConfigService : IConsumptionConfigService
    {
        private readonly IAdoRepository _repository;
        public ConsumptionConfigService(IAdoRepository repository)
        {
            _repository = repository;
        }
        public async Task<string> GetAsync(Dictionary<string, object> parameters)
        {
            var dt = await _repository.GetDataTableAsync("Restaurant.ConfigTpv_Get", parameters);
            if (dt.Rows.Count == 0) { return null; }
            return DataConverters.DataTableToJson(dt);
        }
        public async Task<string> AddAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SpExecuteDeprecatedAsync("Restaurant.ConfigTpv_Insert", parameters);
        }
        public async Task<string> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SpExecuteDeprecatedAsync("Restaurant.ConfigTpv_Update", parameters);
        }
        public async Task<string> DeleteAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SpExecuteDeprecatedAsync("Restaurant.ConfigTpv_Delete", parameters);
        }
        public async Task<string> GetPrinterAsync(Dictionary<string, object> parameters)
        {
            var dt = await _repository.GetDataTableAsync("Restaurant.ConfigPrinter_Get", parameters);
            if (dt.Rows.Count == 0) { return null; }
            return DataConverters.DataTableToJson(dt);
        }
        public async Task<string> AddPrinterAsync(Dictionary<string, object> parameters)
        {
            return await _repository.SpExecuteDeprecatedAsync("Restaurant.ConfigPrinter_Insert", parameters);
        }
    }
}
