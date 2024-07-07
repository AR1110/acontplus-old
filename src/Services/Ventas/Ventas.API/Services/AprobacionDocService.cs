namespace Ventas.API.Services;

public class AprobacionDocService(IAdoSqlServer adoSqlServer) : IAprobacionDocService
{
    private const string NameSchema = "Ventas.Aprob_Document_";

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoSqlServer.GetDataSetAsync($"{NameSchema}Get", parameters, oldSp: true);
        return !DataValidation.DataSetIsNull(ds)
            ? new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds, true) }
            : new ApiResponse { Code = "0", Message = "No se encontraron datos" };
    }

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoSqlServer.SpExecuteAsync<ApiResponse>(NameSchema + "Insert", parameters);
    }

    public async Task<ApiResponse> GetByIdAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoSqlServer.GetDataSetAsync($"{NameSchema}GetId", parameters, oldSp: true);
        return !DataValidation.DataSetIsNull(ds)
            ? new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds, true) }
            : new ApiResponse { Code = "0", Message = "No se encontraron datos" };
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await adoSqlServer.SpExecuteAsync<ApiResponse>(NameSchema + "Update", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await adoSqlServer.SpExecuteAsync<ApiResponse>(NameSchema + "Delete", parameters);
    }

    public async Task<ApiResponse> ConvertToDocAsync(Dictionary<string, object> parameters)
    {
        return await adoSqlServer.SpExecuteAsync<ApiResponse>(NameSchema + "Convert_To_Doc", parameters);
    }
}
