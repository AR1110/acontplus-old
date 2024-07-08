namespace Ventas.API.Services;

public class NotaEntregaService(IAdoSqlServer adoSqlServer) : INotaEntregaService
{
    private const string NameSchema = "Ventas.NotaEntrega_";

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoSqlServer.GetDataSetAsync(NameSchema + "Get", parameters, true, false);
        if (ds.Tables[0].Rows.Count == 0) { return null; }

        return DataConverters.DataSetToJson(ds, true);
    }

    public async Task<object> GetByIdAsync(Dictionary<string, object> parameters)
    {
        var ds = await adoSqlServer.GetDataSetAsync(NameSchema + "GetId", parameters, true);
        if (ds.Tables[0].Rows.Count == 0) { return null; }

        return DataConverters.DataSetToJson(ds, true);
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

    public async Task<ApiResponse> ConvertToDocAsync(Dictionary<string, object> parameters)
    {
        return await adoSqlServer.SpExecuteAsync<ApiResponse>(NameSchema + "Convert_To_Doc", parameters);
    }
}
