
namespace Ventas.API.Services
{
    public class ClienteService(IAdoSqlServer adoSqlServer) : IClienteService
    {
        private const string ModuleName = "Ventas.Cliente_Get_";
        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await adoSqlServer.GetDataSetAsync($"{ModuleName}Get", parameters, oldSp: true);
            return !DataValidation.DataSetIsNull(ds)
                ? new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds, true) }
                : new ApiResponse { Code = "0", Message = "No se encontraron datos" };
        }

        public async Task<ApiResponse> GetDataFormAsync(Dictionary<string, object> parameters)
        {
            var ds = await adoSqlServer.GetDataSetAsync($"{ModuleName}Data_Form", parameters, oldSp: true);
            return !DataValidation.DataSetIsNull(ds)
                ? new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds, true) }
                : new ApiResponse { Code = "0", Message = "No se encontraron datos" };
        }
    }
}
