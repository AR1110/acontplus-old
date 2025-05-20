namespace Ventas.API.Services;

public class NotaEntregaService(IAdoRepository AdoRepository) : INotaEntregaService
{
    private const string NameSchema = "Ventas.NotaEntrega_";

    public async Task<object> GetAsync(Dictionary<string, object> parameters)
    {
        var ds = await AdoRepository.GetDataSetAsync(NameSchema + "Get", parameters, false, false);
        if (ds.Tables[0].Rows.Count == 0) return null;

        return DataConverters.DataSetToJson(ds, true);
    }

    public async Task<object> GetByIdAsync(Dictionary<string, object> parameters)
    {
        var ds = await AdoRepository.GetDataSetAsync(NameSchema + "GetId", parameters, false);
        if (ds.Tables[0].Rows.Count == 0) return null;

        return DataConverters.DataSetToJson(ds, true);
    }

    public async Task<ApiResponse> AddAsync(Dictionary<string, object> parameters)
    {
        return await AdoRepository.SpExecuteAsync<ApiResponse>(NameSchema + "Insert", parameters);
    }

    public async Task<ApiResponse> UpdateAsync(Dictionary<string, object> parameters)
    {
        return await AdoRepository.SpExecuteAsync<ApiResponse>(NameSchema + "Update", parameters);
    }

    public async Task<ApiResponse> CancelAsync(Dictionary<string, object> parameters)
    {
        return await AdoRepository.SpExecuteAsync<ApiResponse>(NameSchema + "Cancel", parameters);
    }

    public async Task<ApiResponse> ConvertToDocAsync(Dictionary<string, object> parameters)
    {
        return await AdoRepository.SpExecuteAsync<ApiResponse>(NameSchema + "Convert_To_Doc", parameters);
    }
}