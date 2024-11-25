using Common.Infrastructure.Repository.Interfaces;

namespace Configuracion.API.Services
{
    public class WhatsappUsageService(IAdoRepository adoRepository) : IWhatsappUsageService
    {
        private const string ModuleName = "Config.WhatsappUsage_";

        public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
        {
            return await adoRepository.SpExecuteAsync<ApiResponse>($"{ModuleName}Insert", parameters);
        }

        public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
        {
            return await adoRepository.SpExecuteAsync<ApiResponse>($"{ModuleName}Delete", parameters);
        }

        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await adoRepository.GetDataSetAsync($"{ModuleName}Get", parameters, false);
            return !DataValidation.DataSetIsNull(ds)
                ? new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds, true) }
                : new ApiResponse { Code = "0", Message = "No data found" };
        }

        public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await adoRepository.SpExecuteAsync<ApiResponse>($"{ModuleName}Update", parameters);
        }
    }
}
