namespace Ventas.API.Services;

public class ProformaService(IAdoSqlServer adoSqlServer) : IProformaService
{
    private const string NameSchema = "Ventas.Proforma_";

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await adoSqlServer.SpExecuteAsync<ApiResponse>(NameSchema + "Insert", parameters);
    }

    public async Task<ApiResponse> ConvertToDoc(Dictionary<string, object> parameters)
    {
        return await adoSqlServer.SpExecuteAsync<ApiResponse>(NameSchema + "Convert_To_Doc", parameters);
    }

    public async Task<ApiResponse> DeleteAsync(Dictionary<string, object> parameters)
    {
        return await adoSqlServer.SpExecuteAsync<ApiResponse>(NameSchema + "Delete", parameters);
    }

    public async Task<ApiResponse> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoSqlServer.GetDataSetAsync($"{NameSchema}Get", parameters, true);
        return !DataValidation.DataSetIsNull(ds)
            ? new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds, true) }
            : new ApiResponse { Code = "0", Message = "No se encontraron datos" };
    }

    public async Task<ApiResponse> GetByIdAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoSqlServer.GetDataSetAsync($"{NameSchema}GetId", parameters, true);
        return !DataValidation.DataSetIsNull(ds)
            ? new ApiResponse { Code = "1", Payload = DataConverters.DataSetToJson(ds, true) }
            : new ApiResponse { Code = "0", Message = "No se encontraron datos" };
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await adoSqlServer.SpExecuteAsync<ApiResponse>(NameSchema + "Update", parameters);
    }
}
