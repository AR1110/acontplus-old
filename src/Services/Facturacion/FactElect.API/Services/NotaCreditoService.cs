
using Common.Infrastructure.Repository;

namespace FactElect.API.Services
{
    public class NotaCreditoService (IAdoRepository adoRepository): INotaCreditoService
    {
        private const string ModuleName = "Ventas.NotaCredito_";

        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await adoRepository.GetDataSetAsync($"{ModuleName}Get", parameters, oldSp: true);
            return !DataValidation.DataSetIsNull(ds)
                ? new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds, true) }
                : new ApiResponse { Code = "0", Message = "No se encontraron datos" };
        }
    }
}
