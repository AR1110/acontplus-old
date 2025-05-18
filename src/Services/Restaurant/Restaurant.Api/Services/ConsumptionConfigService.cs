using Common.Infrastructure.Data.Repository.Interfaces;
using Restaurant.Api.Interfaces;

namespace Restaurant.Api.Services
{
    public class ConsumptionConfigService(IAdoRepository adoRepository) : IConsumptionConfigService
    {
        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            var dt = await adoRepository.GetDataTableAsync("Restaurant.ConfigTpv_Get", parameters);
            return DataValidation.DataTableIsNull(dt)
                ? new ApiResponse { Code = "0", Message = "Data not found!" }
                : new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
        }

        public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
        {
            return await adoRepository.SpExecuteAsync<ApiResponse>("Restaurant.ConfigTpv_Insert", parameters);
        }

        public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await adoRepository.SpExecuteAsync<ApiResponse>("Restaurant.ConfigTpv_Update", parameters);
        }

        public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
        {
            return await adoRepository.SpExecuteAsync<ApiResponse>("Restaurant.ConfigTpv_Delete", parameters);
        }

        public async Task<ApiResponse> GetPrinterAsync(Dictionary<string, object> parameters)
        {
            var dt = await adoRepository.GetDataTableAsync("Restaurant.ConfigPrinter_Get", parameters);
            return DataValidation.DataTableIsNull(dt)
                ? new ApiResponse { Code = "0", Message = "Data not found!" }
                : new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
        }

        public async Task<ApiResponse> AddPrinterAsync(Dictionary<string, object> parameters)
        {
            return await adoRepository.SpExecuteAsync<ApiResponse>("Restaurant.ConfigPrinter_Insert", parameters);
        }
    }
}
