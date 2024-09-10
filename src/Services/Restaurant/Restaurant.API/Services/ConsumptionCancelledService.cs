using Common.Core.Models;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Restaurant.API.Interfaces;

namespace Restaurant.API.Services
{
    public class ConsumptionCancelledService(IAdoRepository adoRepository) : IConsumptionCancelledService
    {
        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            var dt = await adoRepository.GetDataTableAsync("Restaurant.ConsumoAnuladoTpv_Get", parameters);
            return DataValidation.DataTableIsNull(dt)
                ? new ApiResponse { Code = "0", Message = "Data not found!" }
                : new ApiResponse { Code = "1", Payload = DataConverters.DataTableToJson(dt) };
        }

        public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
        {
            return await adoRepository.SpExecuteAsync<ApiResponse>("Restaurant.ConsumoAnuladoTpv_Insert", parameters);
        }

        public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await adoRepository.SpExecuteAsync<ApiResponse>("Restaurant.ConsumoAnuladoTpv_Update", parameters);
        }

        public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
        {
            return await adoRepository.SpExecuteAsync<ApiResponse>("Restaurant.ConsumoAnuladoTpv_Delete", parameters);
        }
    }
}
