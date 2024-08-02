using Common.Infrastructure.Repository;

namespace Ventas.API.Services
{
    public class EmpresaService(IAdoSqlServer adoSqlServer):IEmpresaService
    {
        private const string NameSchema = "Administrador.Empresa_";

        public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
        {
            var ds = await adoSqlServer.GetDataSetAsync($"{NameSchema}Get", parameters);
            return !DataValidation.DataSetIsNull(ds)
                ? new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds) }
                : new ApiResponse { Code = "0", Message = "No se encontraron datos" };
        }

        public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
        {
            return await adoSqlServer.SpExecuteAsync<ApiResponse>(NameSchema + "Insert", parameters);
        }
 

        public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
        {
            return await adoSqlServer.SpExecuteAsync<ApiResponse>(NameSchema + "Update", parameters);
        }

        public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
        {
            return await adoSqlServer.SpExecuteAsync<ApiResponse>(NameSchema + "Delete", parameters);
        } 
    }
}
