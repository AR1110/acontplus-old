using Common.Core.Models;
using Common.Core.Utils;
using Common.Infrastructure.Repository;
using Restaurant.API.Interfaces;

namespace Restaurant.API.Services
{
    public class ConsumptionService(IAdoRepository adoRepository) : IConsumptionService
    {
        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await adoRepository.GetDataSetAsync("Restaurant.ConsumoTpv_Get", parameters, true);
            return DataValidation.DataSetIsNull(ds, true)
                ? new ApiResponse { Code = "0", Message = "Data not found" }
                : new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) };
        }

        public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
        {
            return await adoRepository.SpExecuteAsync<ApiResponse>("Restaurant.ConsumoTpv_Insert", parameters);
        }

        public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await adoRepository.SpExecuteAsync<ApiResponse>("Restaurant.ConsumoTpv_Update", parameters);
        }

        public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
        {
            return await adoRepository.SpExecuteAsync<ApiResponse>("Restaurant.ConsumoTpv_Delete", parameters);
        }

        public async Task<ApiResponse> PrintAsync(Dictionary<string, object> parameters)
        {
            return await adoRepository.SpExecuteAsync<ApiResponse>("Restaurant.ConsumoTpv_Print", parameters);
        }
    }
}
