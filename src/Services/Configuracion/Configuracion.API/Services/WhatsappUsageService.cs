
using Common.Infrastructure.Repository;

namespace Configuracion.API.Services
{
    public class WhatsappUsageService (IAdoRepository adoRepository): IWhatsappUsageService
    {
        private const string ModuleName = "Config.WhatsappUsage_";

        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await adoRepository.GetDataSetAsync($"{ModuleName}Get", parameters, oldSp: true);
            return !DataValidation.DataSetIsNull(ds)
                ? new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds, true) }
                : new ApiResponse { Code = "0", Message = "No data found" };
        }
    }
}
